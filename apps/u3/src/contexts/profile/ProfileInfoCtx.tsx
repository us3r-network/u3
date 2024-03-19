import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ProfileInfoContextValue {
  loadingIdentities: Set<string>;
  cachedProfileInfo: Map<string, any>;
  isLoadingIdentity: (identity: string) => boolean;
  addLoadingIdentity: (identity: string) => void;
  removeLoadingIdentity: (identity: string) => void;
  isCachedProfileInfo: (identity: string) => boolean;
  getCachedProfileInfoWithIdentity: (identity: string) => any;
  upsertCachedProfileInfoWithIdentity: (identity: string, info: any) => void;
}
const ctxDefaultValue: ProfileInfoContextValue = {
  loadingIdentities: new Set(),
  cachedProfileInfo: new Map(),
  isLoadingIdentity: () => false,
  addLoadingIdentity: () => {},
  removeLoadingIdentity: () => {},
  isCachedProfileInfo: () => false,
  getCachedProfileInfoWithIdentity: () => null,
  upsertCachedProfileInfoWithIdentity: () => {},
};
export const ProfileInfoContext = createContext(ctxDefaultValue);

export function ProfileInfoProvider({ children }: PropsWithChildren) {
  const [loadingIdentities, setLoadingIdentities] = useState(
    ctxDefaultValue.loadingIdentities
  );
  const [cachedProfileInfo, setCachedProfileInfo] = useState(
    ctxDefaultValue.cachedProfileInfo
  );
  const isLoadingIdentity = useCallback(
    (identity: string) => loadingIdentities.has(identity),
    [loadingIdentities]
  );
  const addLoadingIdentity = useCallback((identity: string) => {
    setLoadingIdentities((prev) => {
      const newSet = new Set(prev);
      newSet.add(identity);
      return newSet;
    });
  }, []);
  const removeLoadingIdentity = useCallback((identity: string) => {
    setLoadingIdentities((prev) => {
      const newSet = new Set(prev);
      newSet.delete(identity);
      return newSet;
    });
  }, []);

  const isCachedProfileInfo = useCallback(
    (identity: string) =>
      cachedProfileInfo.has(identity) && !!cachedProfileInfo.get(identity),
    [cachedProfileInfo]
  );
  const upsertCachedProfileInfoWithIdentity = useCallback(
    (identity: string, data: any) => {
      setCachedProfileInfo((prev) => {
        const newMap = new Map(prev);
        newMap.set(identity, data);
        return newMap;
      });
    },
    []
  );
  const getCachedProfileInfoWithIdentity = useCallback(
    (identity: string) => cachedProfileInfo.get(identity),
    [cachedProfileInfo]
  );

  return (
    <ProfileInfoContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        loadingIdentities,
        cachedProfileInfo,
        isLoadingIdentity,
        addLoadingIdentity,
        removeLoadingIdentity,
        isCachedProfileInfo,
        upsertCachedProfileInfoWithIdentity,
        getCachedProfileInfoWithIdentity,
      }}
    >
      {children}
    </ProfileInfoContext.Provider>
  );
}

export function useProfileInfoCtx() {
  const context = useContext(ProfileInfoContext);
  if (!context) {
    throw Error(
      'useProfileInfoCtx can only be used within the ProfileInfoProvider component'
    );
  }
  return context;
}
