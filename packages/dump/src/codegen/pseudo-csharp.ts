import { Image } from '@frida-il2cpp/bridge';
import { Class } from '@frida-il2cpp/bridge';
import { Field } from '@frida-il2cpp/bridge';
import { readIl2Cpp } from '@frida-il2cpp/bridge';
import { UnboxedValueType } from '@frida-il2cpp/bridge';
import { Method } from '@frida-il2cpp/bridge';
import { Parameter } from '@frida-il2cpp/bridge';

export class PseudoCsharpGenerator {
    writeImage(image: Image): string {
        return image.classes.map(c => this.write(c)).join(`\n\n`);
    }

    writeClass(klass: Class): string {
        const inherited = [klass.parent].concat(klass.interfaces);

        return `\
// ${klass.assemblyName}
${klass._isEnum ? `enum` : klass.isStruct ? `struct` : klass.isInterface ? `interface` : `class`} \
${klass.type.name}\
${inherited ? ` : ${inherited.map(_ => _?.type.name).join(`, `)}` : ``}
{
    ${klass.fields.map(f => this.write(f)).join(`\n    `)}
    ${klass.methods.map(f => this.write(f)).join(`\n    `)}
}`;
    }

    writeField(field: Field): string {
        return `\
${field.isThreadStatic ? `[ThreadStatic] ` : ``}\
${field.isStatic ? `static ` : ``}\
${field.type.name} \
${field.name}\
${field.isLiteral ? ` = ${field.type.class._isEnum ? readIl2Cpp((field.value as UnboxedValueType).handle, field.type.class.baseType!) : field.value}` : ``};\
${field.isThreadStatic || field.isLiteral ? `` : ` // 0x${field.offset.toString(16)}`}`;
    }

    writeMethod(method: Method): string {
        return `\
${method.isStatic ? `static ` : ``}\
${method.returnType.name} \
${method.name}\
(${method.parameters.map(p => this.write(p)).join(`, `)});\
${method.virtualAddress.isNull() ? `` : ` // 0x${method.relativeVirtualAddress.toString(16).padStart(8, `0`)}`}`;
    }

    writeParameter(parameter: Parameter): string {
        return `${parameter.type.name} ${parameter.name}`;
    }

    write(value: Image | Class | Field | Method | Parameter): string {
        if (value instanceof Image) {
            return this.writeImage(value);
        } else if (value instanceof Class) {
            return this.writeClass(value);
        } else if (value instanceof Field) {
            return this.writeField(value);
        } else if (value instanceof Method) {
            return this.writeMethod(value);
        } else if (value instanceof Parameter) {
            return this.writeParameter(value);
        } else {
            throw new Error(`Invalid value type: ${typeof value}`);
        }
    }

    static generate(value: Image | Class): string {
        return new PseudoCsharpGenerator().write(value);
    }
}
