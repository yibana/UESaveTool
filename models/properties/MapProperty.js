import { Serializer } from '../../utils/Serializer.js';
import {SerializationError, TypeNotImplementedError} from '../PropertyErrors.js';
import { Property } from './index.js'

export class MapProperty extends Property {
    constructor() {
        super();
        this.Property = {};
        this.KeyType = "" ;
        this.ValueType = "" ;
        this.MapSize = 0;
    }
    get Size() {
        let size = this.Name.length + 5;
        size += this.Type.length + 5;
        size += this.KeyType.length + 5;
        size += this.ValueType.length + 5;
        size+=17;
        for (const PropertyKey in this.Property) {
            switch (this.KeyType){
                case "NameProperty":
                    size += PropertyKey.length + 5;
                    break
                case "IntProperty":
                    size += 4;
                    break
                default:
                    throw new TypeNotImplementedError(this.KeyType);
                    break
            }
            switch (this.ValueType.toString()){
                case "IntProperty":
                    size += 4;
                    break
                case "BoolProperty":
                    size += 1;
                    break
                default:
                    throw new TypeNotImplementedError(this.ValueType);
                    break
            }
        }
        return size
    }
    get HeaderSize() {
        let size = this.Name.length + 5;
        size += this.Type.length + 5;
        size += this.KeyType.length + 5;
        size += this.ValueType.length + 5;
        size+=9;
        return size
    }
    deserialize(serial,Size) {
        serial.seek(4);
        this.KeyType = serial.readString();
        this.ValueType = serial.readString();
        let end = serial.tell + Size;
        serial.seek(5);
        this.MapSize = serial.readInt32()
        var _key,_val;
        for (let i = 0; i < this.MapSize; i++) {
            switch (this.KeyType){
                case "NameProperty":
                    _key = serial.readString()
                    break
                case "IntProperty":
                    _key = serial.readInt32()
                    break
                default:
                    throw new TypeNotImplementedError(this.KeyType);
                    break
            }
            switch (this.ValueType.toString()){
                case "IntProperty":
                    _val = serial.readInt32()
                    break
                case "BoolProperty":
                    _val = serial.readUInt8() === 1
                    break
                default:
                    throw new TypeNotImplementedError(this.ValueType);
                    break
            }
            this.Property[_key] = _val
        }
        //serial.seek(end-serial.tell+1)
        return this;
    }
    serialize() {
        let serial = Serializer.alloc(this.Size);
        serial.writeString(this.Name);
        serial.writeString(this.Type);
        serial.writeInt32(this.Size - this.HeaderSize);
        serial.seek(4);
        serial.writeString(this.KeyType);
        serial.writeString(this.ValueType);
        serial.seek(5);
        serial.writeInt32(this.MapSize);
        for (const PropertyKey in this.Property) {
            switch (this.KeyType){
                case "NameProperty":
                    serial.writeString(PropertyKey);
                    break
                case "IntProperty":
                    serial.writeInt32(PropertyKey);
                    break
                default:
                    throw new TypeNotImplementedError(this.KeyType);
                    break
            }
            switch (this.ValueType.toString()){
                case "IntProperty":
                    serial.writeInt32(this.Property[PropertyKey]);
                    break
                case "BoolProperty":
                    serial.writeUInt8(this.Property[PropertyKey]?1:0)
                    break
                default:
                    throw new TypeNotImplementedError(this.ValueType);
                    break
            }
        }
        if (serial.tell !== this.Size)
            throw new SerializationError(this);
        return serial.Data;
    }
    static from(obj) {
        let prop = new MapProperty();
        Object.assign(prop, obj);
        return prop;
    }
}
