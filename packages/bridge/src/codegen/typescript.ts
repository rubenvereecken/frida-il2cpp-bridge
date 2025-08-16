import { Class } from '../structs/class.js';
import { domain } from '../structs/domain.js';
import { Field } from '../structs/field.js';
import { Image } from '../structs/image.js';
import { Method } from '../structs/method.js';
import { Type } from '../structs/type.js';
import { inform } from '../utils/console.js';

function uniqBy<T>(array: T[], keyFn: (item: T) => string): T[] {
    return [...new Map(array.map(item => [keyFn(item), item])).values()];
}

function attachToGlobal(keyValues: Record<string, any>) {
    // Attach keyValues to global object
    for (const key in keyValues) {
        (globalThis as any)[key] = keyValues[key];
    }
}

function log(o: any) {
    if (o instanceof Map) {
    }

    (globalThis as any).console.log(JSON.stringify(o, null, 4));
}

class Path {
    static relativeForNamespaces(namespace: string, dependentNamespace: string) {
        const thisFile = Path.forNamespace(namespace);
        const otherFile = Path.forNamespace(dependentNamespace);

        // Compute the relative path from thisFile to otherFile
        let relativePath = Path.relative(thisFile, otherFile);

        // Ensure the path is in the correct module format
        if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;

        return relativePath;
    }

    static forNamespace(namespace: string) {
        const parts = namespace.split(`.`);
        const filename = parts.pop()!;
        const path = parts.join(`/`);

        if (path.length > 0) return `${path}/${filename}.ts`;
        return `${filename}.ts`;
    }

    static dirname(filePath: string): string {
        const parts = filePath.split('/');
        parts.pop(); // Remove the last part (filename)
        return parts.length ? parts.join('/') : '.';
    }

    static relative(from: string, to: string): string {
        const fromParts = from.split('/').filter(Boolean);
        const toParts = to.split('/').filter(Boolean);

        // Find the common base
        let i = 0;
        while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
            i++;
        }

        // Go up from 'from' to the common ancestor
        const upLevels = fromParts.length - i - 1;
        const upPath = globalThis.Array(upLevels).fill('..');

        // Go down from the common ancestor to 'to'
        const downPath = toParts.slice(i);

        // Combine into a relative path
        return [...upPath, ...downPath].join('/') || '.';
    }
}

class Namer {
    // TODO do some slugifying
    static nameClass(kls: Class) {
        // From outer to inner, including this one
        const classes: Class[] = [kls, ...kls.declaringClasses].reverse();
        // Just get the final bit of each name
        const names = classes.map(kls => kls.name.split('.').pop()!);
        const finalName = names.join('$');
        return finalName;
    }

    static nameType(type: Type) {
        return Namer.nameClass(type.class);
    }

    static name(thing: Class | Type) {
        if (thing instanceof Class) return Namer.nameClass(thing);
        if (thing instanceof Type) return Namer.nameType(thing);
    }
}

type ClassInfo = ReturnType<typeof TypescriptIl2cppAnalyzer.prototype.analyzeClass>;
type FieldInfo = ReturnType<typeof TypescriptIl2cppAnalyzer.prototype.analyzeField>;
type MethodInfo = ReturnType<typeof TypescriptIl2cppAnalyzer.prototype.analyzeMethod>;
type NamespaceInfo = ReturnType<typeof TypescriptIl2cppAnalyzer.prototype.analyzeNamespace>;

type ImageInfo = {
    classes: ClassInfo[];
};

const DUNDER = '$';
const OBJECT = 'object';

class Writer {
    text = '';

    writeLine(str?: string, indent = 0) {
        const line = str ? `${str}\n` : `\n`;
        this.text += ' '.repeat(indent) + line;
    }

    writeBlock(str: string, indent = 0) {
        const lines = str.split('\n');
        for (const line of lines) {
            this.writeLine(line, indent);
        }
    }

    writeNewlines(count: number) {
        for (let i = 0; i < count; i++) {
            this.text += `\n`;
        }
    }
}

export class TypescriptIl2cppAnalyzer {
    analyzeField(field: Field) {}

    analyzeMethod(method: Method) {}

    analyzeClass(klass: Class) {
        // TODO consider what to do for instantiated templates

        // const fields = klass.fields.map(field => this.analyzeField(field));
        // const methods = klass.methods.map(method => this.analyzeMethod(method));
        // const parent = klass.parent ? klass.parent : null;
        // const interfaces = klass.interfaces;

        const dependencies: Type[] = uniqBy(
            [
                ...klass.fields.map(field => field.type),
                ...klass.methods.flatMap(method => [
                    method.returnType,
                    ...method.parameters.map(p => p.type),
                ]),
                ...[klass.parent?.type].filter(Boolean),
                // TODO reinstate once I'm willing to deal with complex types
                // ...interfaces.map(kls => TypeIdWithType.from(kls.type)),
            ],
            type => type!.name
        )
            // Need to know the base type to import
            // TODO do this recursively if needed?
            .map(t => t!.class.elementClass!.type)
            // TODO reintroduce complicated
            .filter(t => !t.class.isInterface);

        return {
            klass,
            dependencies: [...dependencies.values()],
        };
    }

    analyzeImage(image: Image, predicate: (klass: Class) => boolean = () => true) {
        inform(`${image.name} -> ${image.classCount} classes`);
        const classes = image.classes
            // Skip the weird empty `<Module>` class
            .filter(klass => klass.name !== `<Module>`)
            .filter(predicate)
            .map(klass => this.analyzeClass(klass));

        return {
            classes,
        } satisfies ImageInfo;
    }

    analyzeAll() {
        const images = domain.assemblies.map(a => a.image).map(a => this.analyzeImage(a));
        inform(`Analyzed ${images.length} images`);

        const classes = images.flatMap(image => image.classes);
        const classesByNamespace: { [key: string]: ClassInfo[] } = {};
        attachToGlobal({ images, classes });

        const namespaces = this.analyzeNamespaces(classes);

        // log(namespaces)
        return {
            // images,
            // classes,
            namespaces,
        };
    }

    analyzeNamespaces(classes: ClassInfo[]) {
        const classesByNamespace: { [key: string]: ClassInfo[] } = {};
        for (const klass of classes) {
            const namespace = klass.klass.namespace;
            const classes = classesByNamespace[namespace] ?? [];
            classes.push(klass);
            classesByNamespace[namespace] = classes;
        }
        const namespaces = globalThis.Object.entries(classesByNamespace).map(
            ([namespace, classes]) => this.analyzeNamespace(namespace, classes)
        );
        inform(`Analyzed ${namespaces.length} namespaces`);
        inform(namespaces.map(ns => ns.name));
        return namespaces;
    }

    analyzeFromEntrypoint(assemblyName: string, fullTypeName: string) {
        const image = domain.assembly(assemblyName).image;
        const klass = image.class(fullTypeName);
        if (!klass)
            throw new Error(`Class "${fullTypeName}" not found in assembly "${assemblyName}"`);

        const classInfo = this.analyzeClass(klass);
        let allClasses = [classInfo];
        let newClasses = [classInfo];

        // Keep finding all dependencies until the set stops growing
        while (newClasses.length > 0) {
            const newDependencies = newClasses.flatMap(c => c.dependencies);

            // Filter out ones we've seen before
            const uniqNewDependencies = uniqBy(newDependencies, type => type.name).filter(
                type => !allClasses.some(c => c.klass.type.equals(type))
            );

            // newClasses.forEach(klass => {
            //     inform(
            //         `${klass.typeId.formatForLookup()} -> ${klass.dependencies.map(_ => _.formatForLookup())}`
            //     );
            // });

            // Look up the classes
            const newKlasses = uniqNewDependencies.map(t => t.class);
            const oldNewClasses = newClasses;
            newClasses = newKlasses.map(k => this.analyzeClass(k));
            inform(
                `${oldNewClasses.map(c => c.klass.type.name)} -> ${newClasses.map(c => c.klass.type.name)}`
            );
            allClasses = [...allClasses, ...newClasses];
        }

        const namespaces = this.analyzeNamespaces(allClasses);
        return {
            namespaces,
        };
    }

    analyzeNamespace(namespaceName: string, classes: ClassInfo[]) {
        // Unique dependencies by qualifiedName
        const allDependencies = uniqBy(
            classes.flatMap(c => c.dependencies),
            type => type.name
        );

        // Dependencies from this namespace are handled separately
        const externalDependencies = allDependencies.filter(
            c => c.class.namespace !== namespaceName
        );
        const externalDependenciesByNamespace: { [key: string]: Type[] } = {};
        for (const dep of externalDependencies) {
            const namespace = dep.class.namespace;
            const classes = externalDependenciesByNamespace[namespace] ?? [];
            classes.push(dep);
            externalDependenciesByNamespace[namespace] = classes;
        }

        return {
            name: namespaceName,
            classes,
            externalDependenciesByNamespace,
        };
    }

    writeNamespace({ name, classes, externalDependenciesByNamespace }: NamespaceInfo) {
        const writer = new Writer();

        // First, write out all the imports
        globalThis.Object.entries(externalDependenciesByNamespace).forEach(
            ([dependentNamespace, dependencies]) => {
                const relativePath = Path.relativeForNamespaces(name, dependentNamespace);
                const imports = dependencies.map(dep => Namer.name(dep.class)).join(`, `);
                writer.writeLine(`import { ${imports} } from "${relativePath}"`);
            }
        );
        writer.writeNewlines(2);

        // Then write out all the classes
        // No need to order classes by dependencies I think, already done by il2cpp/CS
        classes.forEach(klass => {
            try {
                writer.writeLine(this.writeClass(klass));
                writer.writeNewlines(2);
            } catch (e) {
                inform(`Error writing class ${klass.klass.type.name}: ${e}`);
            }
        });

        return writer.text;
    }

    writeField(field: Field) {
        // TODO wtf is ThreadStatic
        // TODO flexible types like StringLike

        const staticStr = field.isStatic ? `static ` : ``;
        const bindStr = field.isStatic ? `` : `.bind(this.${DUNDER}${OBJECT})`;

        // TODO figure out what kind of Il2Cpp type to use

        return `
${staticStr}get ${Namer.name(field.type)} ${field.name}(): ${Namer.name(field.type)} {
    const value = this.${DUNDER}${OBJECT}.class.field<Il2Cpp.Object>('${field.name}')${bindStr}.value;
    return new ${Namer.name(field.type)}(value);
}

${staticStr}set ${Namer.name(field.type)} ${field.name}(value: ${Namer.name(field.type)}) {
    this.${DUNDER}${OBJECT}.class.field<${Namer.name(field.type)}>('${field.name}')${bindStr}.value = value;
}`;
    }

    // TODO consider a pre-compilation step to gather data before writing out
    writeClass({ klass }: ClassInfo): string {
        const writer = new Writer();

        // TODO templated parents/interfaces
        const extendsStr = klass.parent ? ` extends ${Namer.name(klass.parent.type.class)}` : ``;
        const implementsStr = klass.interfaces.length
            ? ` implements ${klass.interfaces.map(_ => Namer.name(_.type.class)).join(`, `)}`
            : ``;

        const abstractStr = klass.isAbstract ? `abstract ` : ``;

        if (klass.isInterface) throw new Error(`Interfaces not supported yet`);
        if (klass._isEnum) throw new Error(`Enums not supported yet`);
        if (klass.isStruct) throw new Error(`Structs not supported yet`);
        if (klass.isGeneric) throw new Error(`Generic classes not supported yet`);
        if (klass._isValueType) throw new Error(`Value types not supported yet`);

        const fieldsStr = writer.writeLine(`\
// ${klass.type.name} @ ${klass.assemblyName}
${abstractStr}class ${Namer.name(klass)}${extendsStr}${implementsStr} {`);

        // Set up some basic meta behaviour for the base class of all other classes
        if (klass.type.name === `System.Object`)
            writer.writeBlock(this.writeSystemObjectClassContents(), 4);

        // Inherits from `System.Object`
        if (klass.type.name === `System.ValueType`)
            writer.writeBlock(this.writeSystemValueTypeClassContents(), 4);

        klass.fields.forEach(field => writer.writeBlock(this.writeField(field), 4));

        writer.writeLine('}');

        return writer.text;
    }

    writeSystemObjectClassContents() {
        return `\
constructor(public readonly ${DUNDER}${OBJECT}: Il2Cpp.Object) {}
`;
    }

    writeSystemValueTypeClassContents() {
        return `\
constructor(public readonly ${DUNDER}${OBJECT}: Il2Cpp.ValueType) {}
`;
    }

    writeAll({ namespaces }: ReturnType<typeof this.analyzeAll>) {
        namespaces.forEach(namespace => {
            const writer = new Writer();

            const filename = Path.forNamespace(namespace.name);
            inform('// ' + filename);
            writer.writeLine(`// ${filename}`);
            writer.writeLine(this.writeNamespace(namespace));
            (globalThis as any).console.log(writer.text);
        });
    }

    analyzeAndWriteAll() {
        this.writeAll(this.analyzeAll());
    }

    analyzeAndWriteFromEntrypoint(assemblyName: string, fullTypeName: string) {
        this.writeAll(this.analyzeFromEntrypoint(assemblyName, fullTypeName));
    }
}

export const analyzeAll = () => {
    const analyzer = new TypescriptIl2cppAnalyzer();
    return analyzer.analyzeAll();
};
