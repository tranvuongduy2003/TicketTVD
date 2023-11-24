import { User } from '@/models';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  profile: User | null;
};

type Action = {
  setProfile: (profile: Partial<User>) => void;
  reset: () => void;
};

const initState: State = {
  profile: null
};

export const useProfileStore = create(
  persist<State & Action>(
    set => ({
      ...initState,
      setProfile: (updatedProfile: any) =>
        set(state => ({ profile: { ...state.profile, ...updatedProfile } })),
      reset: () => set({ ...initState })
    }),
    {
      name: 'profile', // unique name
      storage: createJSONStorage(() => localStorage)
    }
  )
);
