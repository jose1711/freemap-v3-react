import { ReactElement, ReactNode, useCallback } from 'react';

import 'fm3/styles/toasts.scss';
import { RootAction } from 'fm3/actions';
import { ResolvedToast } from 'fm3/actions/toastsActions';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

interface Props extends Pick<ResolvedToast, 'id' | 'actions' | 'style'> {
  onAction: (id: string, action?: RootAction | RootAction[]) => void;
  onTimeoutStop: (id: string) => void;
  onTimeoutRestart: (id: string) => void;
  message: ReactNode;
}

export function Toast({
  message,
  actions,
  onAction,
  id,
  style,
  onTimeoutStop,
  onTimeoutRestart,
}: Props): ReactElement {
  const handleMouseEnter = useCallback(() => {
    onTimeoutStop(id);
  }, [onTimeoutStop, id]);

  const handleMouseLeave = useCallback(() => {
    onTimeoutRestart(id);
  }, [onTimeoutRestart, id]);

  const handleAlertDismiss = useCallback(() => {
    onAction(id);
  }, [onAction, id]);

  const defaultAction = actions.find(({ name }) => !name);

  const clickHandler = defaultAction
    ? () => onAction(id, defaultAction.action)
    : undefined;

  const buttonActions = actions.filter(({ name }) => name);

  return (
    <Alert
      className="toast"
      variant={style}
      onClick={clickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClose={handleAlertDismiss}
    >
      {typeof message === 'string' && message.startsWith('!HTML!') ? (
        <div
          className="toast-message"
          dangerouslySetInnerHTML={{ __html: message.substring(6) }}
        />
      ) : (
        <div className="toast-message">{message}</div>
      )}
      {buttonActions.length > 0 && (
        <>
          <br />
          <ButtonToolbar>
            {buttonActions.map(({ name, action, style: buttonStyle }) => (
              <Button
                key={name}
                variant={buttonStyle}
                onClick={() => onAction(id, action)}
              >
                {name}
              </Button>
            ))}
          </ButtonToolbar>
        </>
      )}
    </Alert>
  );
}
