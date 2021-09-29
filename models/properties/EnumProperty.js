import { Serializer } from '../../utils/Serializer.js';
import { SerializationError } from '../PropertyErrors.js';
import { Property } from './index.js';

export class EnumProperty extends Property {
    constructor() {
        super();
        this.EnumType = "";
        this.Property = "";
    }
    get Size() {
        return this.Name.length + 5
            + this.Type.length + 5
            + this.Property.length + 5
            + this.EnumType.length + 5
            + 9;
    }
    deserialize(serial) {
        serial.seek(4);
        this.EnumType = serial.readString();
        serial.seek(1);
        this.Property = serial.readString();
        return this;
    }
    serialize() {
        let serial = Serializer.alloc(this.Size);
        serial.writeString(this.Name);
        serial.writeString(this.Type);
        serial.writeInt32(this.Property.length + 5);
        serial.seek(4);
        serial.writeString(this.EnumType);
        serial.seek(1);
        serial.writeString(this.Property);
        if (serial.tell !== this.Size)
            throw new SerializationError(this);
        return serial.Data;
    }
    static from(obj) {
        let prop = new EnumProperty();
        Object.assign(prop, obj);
        return prop;
    }
}
