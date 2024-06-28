import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MpesaAuthService } from '../mpesa-auth.service';
import { mpesaConfig } from 'mpesa.config';

@Injectable()
export class MpesaService {
  constructor(private authService: MpesaAuthService) {}

  private readonly baseUrl =
    mpesaConfig.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

  async checkTransaction(transactionId: string): Promise<any> {
    const accessToken = await this.authService.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/transactionstatus/v1/query`,
        {
          Initiator: 'shaphankirui', // Replace with your actual initiator name
          SecurityCredential:
            'b0Oh4jg9J2bHamYU7pVhkP+lCE8YpA7IJhbbDMwGpnh3S0ikFzpssesE+wutnKooQqpeKiSQSK+jw1cbULcPCpNoTYVAwJO2Oj8CeIXVROkBqXX33HBevvFyeh467Flwi18lEeNROUYGp+kMJRl2JSLq9e+y19+6qVUoiYcLVcQ6UDl/LobU85zC9FbKZ6rDyPqibVOqXkgOn0NTwDlfHDRgSROcFoirBaGBtiwoVsIMYv2bv3CdiQQIu9qoMr50viKPDoKiO+nYqYp44mSvokqB6tB87vgXnhgyb6vr92yWcuY0UdX60cBu3wJm821Jp/Zk0L/BAgrhwLAH4ujb+Q==', // This should be an encrypted credential
          CommandID: 'TransactionStatusQuery',
          TransactionID: transactionId,
          PartyA: mpesaConfig.shortcode,
          IdentifierType: '4',
          ResultURL: 'https://your-server.com/api/result', // Your actual result URL
          QueueTimeOutURL: 'https://your-server.com/api/timeout', // Your actual timeout URL
          Remarks: 'Check transaction',
          Occasion: 'Check',
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to check M-Pesa transaction');
    }
  }
}
