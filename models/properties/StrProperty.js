import { Property } from './index.js'
import { Serializer } from '../../utils/Serializer.js';

export class StrProperty extends Property {
    constructor() {
        super();
        this.Property = "";
    }
    get Size() {
        return this.Name.length + 5
            + this.Type.length + 5
            + this.Property.length + 5
            + 9;
    }
    deserialize(serial) {
        serial.seek(5);
        this.Property = serial.readString();
        return this;
    }
    serialize() {
        let serial = Serializer.alloc(this.Size);
        serial.writeString(this.Name);
        serial.writeString(this.Type);
        serial.writeInt32(this.Property.length + 5);
        serial.seek(5);
        serial.writeString(this.Property);
        if (serial.tell !== this.Size)
            throw new SerializationError(this);
        return serial.Data;
    }
    static from(obj) {
        let prop = new StrProperty();
        Object.assign(prop, obj);
        return prop;
    }
}
