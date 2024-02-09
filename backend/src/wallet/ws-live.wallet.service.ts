import {
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { UserDto } from '../users/dto/user.dto';
import { WalletService } from './wallet.service';

@WebSocketGateway({
  namespace: 'live',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WalletLiveService implements OnGatewayInit, OnGatewayDisconnect {
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
    const bearerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      socket.request,
    );
    return new Promise(async (resolve, reject) => {
      try {
        const user =
          await this.authService.getUserFromAuthenticationToken(bearerToken);
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
}
