import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Crud({
    model: {
        type: Product,
    },
    query: {
        join: {
            commands: {
                eager: true,
            },
        },
    },
})
@ApiTags('product')
@Controller('products')
export class ProductController {
    constructor(public readonly service: ProductService) {}
}
