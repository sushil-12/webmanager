import { AxiosInstance } from 'axios';

class CommanService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllDomains(): Promise<any> {
    return this.api.get('/api/common/get-all-domains');
  }

 
}

export default CommanService;