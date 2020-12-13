import { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { FontAwesomeIcon } from 'fm3/components/FontAwesomeIcon';
import { setActiveModal } from 'fm3/actions/mainActions';

import legend from 'fm3/legend/index.json';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

interface LegendItem {
  n: string;
  items: {
    i: string;
    n: string;
  }[];
}

type Props = { show: boolean };

export function LegendModal({ show }: Props): ReactElement {
  const dispatch = useDispatch();

  const close = useCallback(() => {
    dispatch(setActiveModal(null));
  }, [dispatch]);

  return (
    <Modal show={show} onHide={close} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon="map-o" /> Legenda mapy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Legenda k vrstvám <i>Automapa, Turistická, Cyklomapa a Lyžiarska</i>:
        </p>
        <Accordion>
          {legend.map((c: LegendItem, i: number) => (
            <Card key={c.n}>
              <Accordion.Toggle as={Card.Header} eventKey={String(i)}>
                {c.n}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(i)}>
                <Card.Body>
                  {c.items.map((e) => (
                    <div key={e.n} className="legend-item">
                      <div>
                        <div>
                          <img src={require(`fm3/legend/${e.i}`)} alt={e.n} />
                        </div>
                      </div>
                      <div>{e.n}</div>
                    </div>
                  ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={close}>
          <FontAwesomeIcon icon="close" /> Zavrieť
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
