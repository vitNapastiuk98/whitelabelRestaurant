import { Injectable, PipeTransform } from '@nestjs/common'
import { BadRequestError } from '../lib/errors'

@Injectable()
export class JsonBodyPipe implements PipeTransform {
    transform(value: unknown): Record<string, unknown> {
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestError('Invalid JSON object')
        return value as Record<string, unknown>
    }
}
