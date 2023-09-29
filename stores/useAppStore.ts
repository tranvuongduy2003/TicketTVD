import { User } from '@/models';
import { TokenPayload } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  token: TokenPayload;
  loggedIn: boolean;
  profile: User | null;
};

type Action = {
  setToken: (token: TokenPayload) => void;
  setLoggedIn: (status: boolean) => void;
  setProfile: (profile: User) => void;
  reset: () => void;
};

const initState: State = {
  token: {
    accessToken: '',
    refreshToken: ''
  },
  loggedIn: false,
  profile: null
};

export const useAuthStore = create(
  persist<State & Action>(
    set => ({
      ...initState,
      setToken: (token: TokenPayload) => set(state => ({ token })),
      setLoggedIn: (status: boolean) => set(state => ({ loggedIn: status })),
      setProfile: (updatedProfile: any) =>
        set(state => ({ profile: { ...state.profile, ...updatedProfile } })),
      reset: () => set({ ...initState })
    }),
    {
      name: 'auth', // unique name
      storage: createJSONStorage(() => localStorage)
    }
  )
);
