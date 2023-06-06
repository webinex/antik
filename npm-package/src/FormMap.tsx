import { FormikContextType, FormikProps, getIn } from 'formik';
import React from 'react';

const MAP: Record<string, React.MutableRefObject<FormikProps<any> | undefined>> = {};
const SUBSCRIBERS: Record<string, Array<(values: any) => any>> = {};

function setRef(uid: string, formik: FormikContextType<any>) {
  MAP[uid] = MAP[uid] ?? React.createRef<FormikContextType<any>>();
  MAP[uid].current = formik;
}

function notifySubscribers(uid: string, formik: FormikContextType<any>) {
  const { values } = formik;
  const subscribers = SUBSCRIBERS[uid] ?? [];

  for (const subscriber of subscribers) {
    subscriber(values);
  }
}

function set(uid: string, formik: FormikContextType<any>) {
  setRef(uid, formik);
  notifySubscribers(uid, formik);
}

function getOrCreateRef(uid: string) {
  MAP[uid] = MAP[uid] ?? React.createRef<FormikContextType<any>>();
  return MAP[uid];
}

function destroy(uid: string) {
  if (MAP[uid]) {
    MAP[uid].current = undefined;
  }

  SUBSCRIBERS[uid] = undefined!;
}

function subscribe<TValue>(uid: string, name: string, callback: (value: TValue) => any) {
  SUBSCRIBERS[uid] = SUBSCRIBERS[uid] ?? [];

  const subscription = (values: any) => callback(getIn(values, name));
  SUBSCRIBERS[uid].push(subscription);

  return () => {
    SUBSCRIBERS[uid] = SUBSCRIBERS[uid].slice().splice(SUBSCRIBERS[uid].indexOf(subscription), 1);
  };
}

export const FormMap = {
  set,
  getRef: getOrCreateRef,
  subscribe,
  destroy,
};
