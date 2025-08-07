namespace Il2Cpp {
    export class PseudoCsharpGenerator {
        writeImage(image: Il2Cpp.Image): string {
            return image.classes.map(c => this.write(c)).join(`\n\n`);
        }

        writeClass(klass: Il2Cpp.Class): string {
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

        writeField(field: Il2Cpp.Field): string {
            return `\
${field.isThreadStatic ? `[ThreadStatic] ` : ``}\
${field.isStatic ? `static ` : ``}\
${field.type.name} \
${field.name}\
${field.isLiteral ? ` = ${field.type.class._isEnum ? readIl2Cpp((field.value as Il2Cpp.ValueType).handle, field.type.class.baseType!) : field.value}` : ``};\
${field.isThreadStatic || field.isLiteral ? `` : ` // 0x${field.offset.toString(16)}`}`;
        }

        writeMethod(method: Il2Cpp.Method): string {
            return `\
${method.isStatic ? `static ` : ``}\
${method.returnType.name} \
${method.name}\
(${method.parameters.map(p => this.write(p)).join(`, `)});\
${method.virtualAddress.isNull() ? `` : ` // 0x${method.relativeVirtualAddress.toString(16).padStart(8, `0`)}`}`;
        }

        writeParameter(parameter: Il2Cpp.Parameter): string {
            return `${parameter.type.name} ${parameter.name}`;
        }

        write(
            value: Il2Cpp.Image | Il2Cpp.Class | Il2Cpp.Field | Il2Cpp.Method | Il2Cpp.Parameter
        ): string {
            if (value instanceof Il2Cpp.Image) {
                return this.writeImage(value);
            } else if (value instanceof Il2Cpp.Class) {
                return this.writeClass(value);
            } else if (value instanceof Il2Cpp.Field) {
                return this.writeField(value);
            } else if (value instanceof Il2Cpp.Method) {
                return this.writeMethod(value);
            } else if (value instanceof Il2Cpp.Parameter) {
                return this.writeParameter(value);
            } else {
                throw new Error(`Invalid value type: ${typeof value}`);
            }
        }

        static generate(value: Il2Cpp.Image | Il2Cpp.Class): string {
            return new PseudoCsharpGenerator().write(value);
        }
    }
}
