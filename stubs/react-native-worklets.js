// Web stub for react-native-worklets (native-only package)
// Reanimated v4 imports this but on web it uses its own implementations.
export const executeOnUIRuntimeSync = () => {};
export const runOnUI = (fn) => fn;
export const runOnUIAsync = (fn) => fn;
export const runOnUISync = (fn) => fn;
export const runOnJS = (fn) => fn;
export const makeShareable = (val) => val;
export const makeShareableCloneRecursive = (val) => val;
export const makeShareableCloneOnUIRecursive = (val) => val;
export const isShareableRef = () => false;
export const createWorkletRuntime = () => ({});
export const runOnRuntime = (fn) => fn;
export const callMicrotasks = () => {};
export const scheduleOnUI = () => {};
export const scheduleOnRN = () => {};
export const isWorkletFunction = () => false;
export const getStaticFeatureFlag = () => false;
export const setDynamicFeatureFlag = () => {};
export const isSynchronizable = () => false;
export const createSynchronizable = () => ({});
export const createSerializable = () => ({});
export const isSerializableRef = () => false;
export const shareableMappingCache = { get: () => null, set: () => {}, delete: () => {} };
export const serializableMappingCache = { get: () => null, set: () => {}, delete: () => {} };
export const WorkletsModule = {};
export const RuntimeKind = { UI: 'UI', RN: 'RN' };
export const getRuntimeKind = () => 'RN';
export const unstable_eventLoopTask = (fn) => fn;
