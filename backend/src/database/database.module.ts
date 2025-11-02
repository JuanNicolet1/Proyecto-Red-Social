import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRoot('mongodb+srv://juan:arauz1095@cluster0.x8l8nl9.mongodb.net/?appName=Cluster0')],
    exports: [MongooseModule],
})
export class DatabaseModule {}
