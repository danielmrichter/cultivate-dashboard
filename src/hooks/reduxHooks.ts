import { useDispatch, TypedUseSelectorHook, useStore, useSelector } from "react-redux";
import { AppStore, AppDispatch, RootState } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore