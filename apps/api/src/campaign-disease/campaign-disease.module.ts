import { Module } from '@nestjs/common';
import { CampaignDiseaseController } from './campaign-disease.controller';
import { CampaignDiseaseService } from './campaign-disease.service';

@Module({
  controllers: [CampaignDiseaseController],
  providers: [CampaignDiseaseService],
})
export class CampaignDiseaseModule {}
