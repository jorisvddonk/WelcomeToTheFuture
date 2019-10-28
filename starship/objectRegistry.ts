const registry = new Map()
export type ObjectID = string;
export default {
  add: obj => {
    const objid = obj.name
    if (objid !== null && objid !== undefined) {
      return registry.set(objid, obj)
    }
  },
  remove: obj => {
    if (typeof obj === 'object') {
      return registry.delete(obj.name)
    } else {
      return registry.delete(obj)
    }
  },
  get: objid => {
    return registry.get(objid)
  },
  has: objid => {
    return registry.has(objid)
  },
}
