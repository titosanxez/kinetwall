import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { UserDto } from '../users/dto/user.dto';
import { WalletService } from './wallet.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3030'],
    preflightContinue: false,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'Authorization',
      'sec-websocket-protocol',
    ],
    exposedHeaders: ['sec-websocket-protocol'],
  },
  allowEIO3: true,
})
export class WalletLiveService
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;
  private registeredClients: Map<Socket, UserDto> = new Map<Socket, UserDto>();
  private pollingInterval: NodeJS.Timeout;

  constructor(
    private authService: AuthService,
    private walletService: WalletService,
  ) {
    this.startPeriodicUpdates();
  }

  afterInit(server: Server): any {
    server.use((socket, next) => {
      this.getUserFromSocket(socket)
        .then((user) => {
          this.registeredClients.set(socket, user);
          next();
        })
        .catch(() => {
          next(new UnauthorizedException('Invalid credentials'));
        });
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket): any {
    this.registeredClients.delete(client);
  }

  private async sendWalletUpdates() {
    for (const [client, user] of this.registeredClients) {
      const wallets = await this.walletService.getWallets(user.userId);
      client.emit('wallet', wallets);
    }
  }

  private getUserFromSocket(socket: Socket): Promise<UserDto | undefined> {
    // Get auth header
    let authToken = ExtractJwt.fromHeader('sec-websocket-protocol')(
      socket.request,
    );
    if (!authToken) {
      authToken = ExtractJwt.fromAuthHeaderAsBearerToken()(socket.request);
    }
    return new Promise(async (resolve, reject) => {
      try {
        const user =
          await this.authService.getUserFromAuthenticationToken(authToken);
        if (user) {
          resolve(user);
        } else {
          reject(new WsException('Invalid access token'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private startPeriodicUpdates() {
    if (this.pollingInterval !== undefined) {
      return;
    }
    this.pollingInterval = setInterval(async () => {
      await this.sendWalletUpdates();
    }, 5000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    client.emit('headers', {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    });
  }
}


