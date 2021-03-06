import { RootAction } from 'fm3/actions';
import { sendError } from 'fm3/globalErrorHandler';
import { RootState } from 'fm3/storeCreator';
import { Dispatch, Middleware } from 'redux';

export const errorHandlingMiddleware: Middleware<
  RootAction | null,
  RootState,
  Dispatch<RootAction>
> = () => (next: Dispatch) => (action: RootAction): RootAction | null => {
  try {
    // TODO
    // if (action.type === at.UNHANDLED_LOGIC_ERROR) {
    //   sendError({ kind: 'unhandledLogic', error: action.payload });
    //   return null;
    // }

    return next(action);
  } catch (error) {
    sendError({ kind: 'reducer', error, action });
    return null;
  }
};
