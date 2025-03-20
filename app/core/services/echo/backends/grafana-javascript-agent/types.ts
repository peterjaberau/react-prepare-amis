import { CurrentUserDTO } from '@data/index';
import { EchoEvent, EchoEventType } from '@runtime/index';

export interface BaseTransport {
  sendEvent(event: EchoEvent): PromiseLike<Response>;
}

export type GrafanaJavascriptAgentEchoEvent = EchoEvent<EchoEventType.GrafanaJavascriptAgent>;

export interface User extends Pick<CurrentUserDTO, 'email'> {
  id: string;
  orgId?: number;
}
