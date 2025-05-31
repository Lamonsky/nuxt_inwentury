<script lang="ts" setup>

const { public: publicConfig } = useRuntimeConfig();
const externalLink = publicConfig.externalLink;

interface Inwentura {
  id: number;
  name: string;
  project: {
    customer: {
      name: string;
    };
    customerType: string;
    contractDate: Date;
    address: string;
    city: {
      name: string;
    };
  };
  currentWorkersNumber: number;
  maxWorkersNumber: number;
  projectLocation: string;
}

const list_inwentury = ref<Inwentura[]>([]);
const filtered_list_inwentury = ref<Inwentura[]>([]);



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
        list_inwentury.value.push({
          id: element.id,
          name: element.name,
          project: {
            customer: {
              name: element.project.customer.name,
            },
            customerType: element.project.customerType,
            contractDate: element.project.contractDate,
            address: element.project.address,
            city: {
              name: element.project.city.name,
            },
          },
          currentWorkersNumber: element.currentWorkersNumber,
          maxWorkersNumber: element.maxWorkersNumber,
          projectLocation: element.projectLocation.name,
        });
        
      }
      } else {
      console.warn(`Unexpected data format from: ${url}`, inwentury.value);
      }
    }

    // Sortowanie listy po contractorDate
    list_inwentury.value.sort((a, b) => {
      const dateA = new Date(a.project.contractDate).getTime() || 0;
      const dateB = new Date(b.project.contractDate).getTime() || 0;
      if (dateA > dateB) {
        return 1;
      }
      if (dateA < dateB) {
        return -1;
      }
      return dateA - dateB;
    });

    list_inwentury.value.forEach((inwentura) => {
      // Obliczanie odległości dla każdego elementu
      inwentura.project.contractDate = formatDateToString(new Date(inwentura.project.contractDate));
    });
    filtered_list_inwentury.value = list_inwentury.value;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading = false; // Ustawienie na false po zakończeniu ładowania
    console.log('Data fetching completed. List:', list_inwentury.value.length);
  }
};


function formatDateToString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


let searchQuery = ref('');
console.log('Initial search query:', searchQuery.value);

function filterData() {
  if (searchQuery.value.length < 3) {
    // Jeśli zapytanie jest puste, przywróć oryginalną listę
    filtered_list_inwentury.value = list_inwentury.value;
  } else {
    // Filtruj dane na podstawie zapytania
    filtered_list_inwentury.value = list_inwentury.value.filter((inwentura) => {
      return (
        inwentura.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inwentura.project.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inwentura.project.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inwentura.project.city.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inwentura.project.contractDate.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        inwentura.project.customerType.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }
}

// Wywołanie funkcji fetchData
fetchData();
</script>

<template>
  <div>
    <input
        type="text"
        placeholder="Search Inwentura"
        class="input input-bordered input-primary w-full max-w-xs m-2"
        v-model="searchQuery"
        v-on:input="filterData"
      />
      <div class="flex flex-wrap justify-start overflow-x-auto rounded-box border border-base-content/5 m-2 bg-base-100">
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Current</th>
                    <th>Max</th>
                    <th>Customer Type</th>
                    <th>Project Location</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody v-for="inwentura in filtered_list_inwentury" :key="inwentura.id" >
                <tr>
                    <td>{{ inwentura.name }}</td>
                    <td>{{ inwentura.project.customer.name }}</td>
                    <td>{{ inwentura.project.contractDate }}</td>
                    <td>{{ inwentura.project.address }} {{ inwentura.project.city.name }}</td>
                    <td>{{ inwentura.currentWorkersNumber }}</td>
                    <td>{{ inwentura.maxWorkersNumber }}</td>
                    <td>{{ inwentura.project.customerType }}</td>
                    <td>{{ inwentura.projectLocation }}</td>
                    <td>
                        <a :href="`${externalLink}/${inwentura.id}`" target="_blank">
                            <button class="btn btn-primary btn-sm">Go to Inwentura</button>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>

      
  </div>

</template>