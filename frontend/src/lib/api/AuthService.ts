import { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(identifier: string, password: string, staySignedIn: string, form_type: string, verification_code: string, recaptcha_key:string): Promise<any> {
    let data = identifier.includes('@') ? { email: identifier, password, staySignedIn, form_type, verification_code, recaptcha_key } : { username: identifier, password, staySignedIn, form_type, verification_code };
    localStorage.setItem('domain', 'he_group')
    return this.api.post('/auth/login', data);
  }
  async resetPassword(password: string, form_type: string, reset_token: string, recaptcha_key:string): Promise<any> {
    let data = { password, form_type, reset_token, recaptcha_key };
    return this.api.post('/auth/reset-password', data);
  }
  async editProfile(name: string, id: string, bio: string, profile_pic?: File, email?: string, password?: string): Promise<any> {
    let data = { name, id, bio, profile_pic, email, password };
    return this.api.post('/auth/update-profile', data);
  }

  async register(user: object): Promise<any> {
    return this.api.post('/auth/register', user);
  }

  async checkUsername(username: string): Promise<any> {
    return this.api.post('/auth/check-username', { username });
  }

  async checkEmail(email: string): Promise<any> {
    return this.api.post('/auth/check-email', { email });
  }

  async logout(): Promise<any> {
    return this.api.post('/auth/logout');
  }

  // Verify Email route
  async verifyEmail(verify: object): Promise<any> {
    return this.api.post('/auth/verify-email', verify);
  }
}

export default AuthService;