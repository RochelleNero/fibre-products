import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-fibre-products',
  templateUrl: './fibre-products.component.html',
  styleUrls: ['./fibre-products.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FibreProductsComponent implements OnInit {
  // Hard coded the provider info becuase I would not access the endpoint provided
  providerInfo = [
    {
      code: 'centurycity',
      name: 'Century City Connect',
      url: 'https://www.mweb.co.za/media/images/providers/provider-century.png'
    },
    {
      code: 'evotel',
      name: 'Evotel',
      url: 'https://www.mweb.co.za/media/images/providers/provider-evotel.png'
    },
    {
      code: 'octotel',
      name: 'Octotel',
      url: 'https://www.mweb.co.za/media/images/providers/provider-octotel.png'
    },
    {
      code: 'vumatel',
      name: 'Vumatel',
      url: 'https://www.mweb.co.za/media/images/providers/provider-vuma.png'
    },
    {
      code: 'openserve',
      name: 'OpenServe',
      url: 'https://www.mweb.co.za/media/images/providers/provider-openserve.png'
    },
    {
      code: 'frogfoot',
      name: 'Frogfoot',
      url: 'https://www.mweb.co.za/media/images/providers/provider-frogfoot.png'
    },
    {
      code: 'mfn',
      name: 'MFN',
      url: 'https://www.mweb.co.za/media/images/providers/provider-metrofibre.png'
    },
    {
      code: 'vodacom',
      name: 'Vodacom',
      url: 'https://www.mweb.co.za/media/images/providers/provider-vodacom.png'
    },
    {
      code: 'linkafrica',
      name: 'Link Africa',
      url: 'https://www.mweb.co.za/media/images/providers/provider-linkafrica.png'
    },
    {
      code: 'linklayer',
      name: 'Link Layer',
      url: 'https://www.mweb.co.za/media/images/providers/provider-link-layer.png'
    },
    {
      code: 'lightstruck',
      name: 'Lightstruck',
      url: 'https://www.mweb.co.za/media/images/providers/provider-lightstruck.png'
    },
    {
      code: 'mitchells',
      name: 'Mitchells Fibre',
      url: 'https://www.mweb.co.za/media/images/providers/provider-mitchells.png'
    },
    {
      code: 'vumareach',
      name: 'Vuma Reach',
      url: 'https://www.mweb.co.za/media/images/providers/provider-vuma.png'
    }
  ];

  baseURL = 'https://apigw.mweb.co.za/prod/baas/proxy';
  campaignsURL = 'https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public';
  campaigns: any[] = [];
  dealTypes = ['FREE setup and FREE router', 'Prepaid Fibre'];
  selectedDealType = '';
  selectedCampaign: any[] = [];
  promocodes: any[] = [];
  promcodeProductsURL = '';

  promocodeProducts: any[] = [];
  products: any[] = [];
  summarizedProducts: any[] = [];
  providers: any[] = [];
  selectedProducts: any = [];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    arrows: true,
    variableWidth: true
  };

  ngOnInit(): void {
    this.getCampaigns();
}

  getCampaigns(): void{
    fetch(this.campaignsURL)
    .then((response) => {
      return response.json();
    })
    .then((campaigns) => {
      this.campaigns = campaigns;
    });
  }

  dealType(): void{
    this.selectedProducts = [];
    this.selectedCampaign = Object.values(this.campaigns)[0].filter((value: { name: string; }) => {
      return value.name === this.selectedDealType;
    });

    this.selectedCampaign.filter(value => {
      return this.promocodes.push(value.promocodes);
    });

    this.getPromoCodeProducts();

  }

  getPromoCodeProducts(): void{
    this.promcodeProductsURL = `${this.baseURL}/marketing/products/promos/${this.promocodes.join(',')}?sellable_online=true`;

    fetch(this.promcodeProductsURL)
    .then((response) => {
      return response.json();
    })
    .then((promocodeProducts) => {
      this.promocodeProducts = promocodeProducts;

      const summarizedProducts = Object.values(this.promocodeProducts).filter(value => {
        return this.products.push(value.products);
      });

      this.products.forEach((item: []) => {
      const result = item.map(({ productCode, productName, productRate, subcategory }) => ({
        productCode,
        productName,
        productRate,
        subcategory
      }));
      this.summarizedProducts.push(result);
      });

      this.summarizedProducts.forEach((item: []) => {
        const providers = Object.values(item).filter((value: { subcategory: string; }) => {
          return this.providers.push(value.subcategory.replace('Uncapped', '').replace('Capped', '').trim());
        });

        });
    });
  }

  selectProvider(event: any): void{
    this.selectedProducts = [];
    const selectedProvider = event.target.id;
    this.summarizedProducts.forEach((item: []) => {
        const selectedProduct = Object.values(item).filter((value: { subcategory: string; }) => {
          return value.subcategory.replace('Uncapped', '').replace('Capped', '').trim() === selectedProvider;
        });
        if (selectedProduct.length !== 0){
              this.selectedProducts.push(selectedProduct);
            }
        });
  }

}


