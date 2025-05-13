<script lang="ts" setup>
import { calculateDistance } from './scripts/calculateDistance';
import { getCoordinates } from './scripts/getCoordinates';

const { public: publicConfig } = useRuntimeConfig();
const externalLink = publicConfig.externalLink;

const myAddress = 'Złotów Bohaterów Westerplatte 12';
const myCoordinates = await getCoordinates(myAddress);

interface Inwentura {
  id: number;
  name: string;
  project: {
    customer: {
      name: string;
    };
    customerType: string;
    contractDate: string;
    address: string;
    city: {
      name: string;
    };
  };
  currentWorkersNumber: number;
  maxWorkersNumber: number;
  distance?: number; // Dodano pole distance
}

let list_inwentury: Inwentura[] = [];


let isLoading = true; // Dodano zmienną śledzącą stan ładowania
let urls: string[] = [];
urls.push('https://api.inwentury.pl/errands?page=1&district=98');
urls.push('https://api.inwentury.pl/errands?page=1&district=188');
urls.push('https://api.inwentury.pl/errands?page=1&district=237');
urls.push('https://api.inwentury.pl/errands?page=1&district=227');
urls.push('https://api.inwentury.pl/errands?page=1&district=375');

const fetchData = async () => {
  try {
    for (const url of urls) {
      console.log(`Fetching data from: ${url}`);
      const inwentury = await $fetch<Inwentura[]>(url);
      
      let response = inwentury['hydra:member'] ?? [];

      // Sprawdzenie, czy dane są poprawne
      if (response.length > 0 && Array.isArray(response)) {
      for (const element of response) {
        const inwentura_address = element.project.city.name;
        const inwentura_coordinates = await getCoordinates(inwentura_address);

        const distance = calculateDistance(myCoordinates, inwentura_coordinates);

        list_inwentury.push({
          id: element.id,
          name: element.name,
          project: {
            customer: {
              name: element.project.customer.name,
            },
            customerType: element.project.customerType,
            contractDate: new Date(element.project.contractDate).toISOString().replace('T', ' ').slice(0, 16),
            address: element.project.address,
            city: {
              name: element.project.city.name,
            },
          },
          currentWorkersNumber: element.currentWorkersNumber,
          maxWorkersNumber: element.maxWorkersNumber,
          distance: distance,
        });
        
      }
      } else {
      console.warn(`Unexpected data format from: ${url}`, inwentury.value);
      }
    }

    // Sortowanie listy po contractorDate
    list_inwentury.sort((a, b) => new Date(a.project.contractDate).getTime() - new Date(b.project.contractDate).getTime());

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading = false; // Ustawienie na false po zakończeniu ładowania
    console.log('Data fetching completed. List:', list_inwentury.length);
  }
};

// Wywołanie funkcji fetchData
fetchData();
</script>

<template>
  <div data-theme="retro">
      <div class="flex flex-wrap justify-start">
        <div v-for="inwentura in list_inwentury" :key="inwentura.id" class="lg:w-1/4 md:w-1/2 sm:w-full">
          <div class="card bg-base-300 shadow-sm m-5">
            <div class="card-body">
              <h2 class="card-title">
                {{ inwentura.name }}
              </h2>
              <p>Customer: {{ inwentura.project.customer.name }}</p>
              <p>Date: {{ inwentura.project.contractDate }}</p>
              <p>Address: {{ inwentura.project.address }} {{ inwentura.project.city.name }}</p>
              <p>Current Workers Number: {{ inwentura.currentWorkersNumber }}</p>
              <p>Max Workers Number: {{ inwentura.maxWorkersNumber }}</p>
              <p>Customer Type: {{ inwentura.project.customerType }}</p>
              <p>Distance: {{ inwentura.distance }}</p>
              <a class="justify-self-end" :href="`${externalLink}/${inwentura.id}`" target="_blank">
                <button class="btn btn-primary ">
                  Go to Inwentura
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
  </div>

</template>