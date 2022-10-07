import { SetMetadata } from '@nestjs/common';

export const IS_INACTIVE_KEY = 'isInactive';
export const Inactive = () => SetMetadata(IS_INACTIVE_KEY, true);
