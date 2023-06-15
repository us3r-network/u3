/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 10:00:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 14:11:59
 * @Description: file description
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
