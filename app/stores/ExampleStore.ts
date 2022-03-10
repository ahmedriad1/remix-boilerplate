import create from 'zustand'

interface IExampleStore {
  open: boolean

  toggle: () => void
  setOpen: (open: boolean) => void
}

const defaultState = {
  open: false,
}

const useExampleStore = create<IExampleStore>(set => ({
  ...defaultState,
  toggle: () => set(state => ({ open: !state.open })),
  setOpen: open => set(() => ({ open })),
}))

export default useExampleStore
