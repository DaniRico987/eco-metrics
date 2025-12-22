import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './models/auth-payload.model';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('data') data: LoginInput) {
    return this.authService.login(data.email, data.password);
  }

  @Mutation(() => AuthPayload)
  async register(@Args('data') data: RegisterInput) {
    return this.authService.register(data);
  }
}
