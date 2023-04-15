import { useMemo } from 'react';
import { createEntireLoadOptionSource } from './../src';

const USER_LIST = [
  {
    id: 'bce04a14-c79c-4715-8a09-a06dfd1e6424',
    name: 'Angelia Iskow',
  },
  {
    id: '667db26c-0775-4fe2-87ae-3a47a3e1a419',
    name: 'Manda Fosberry',
  },
  {
    id: 'cfb80198-ae39-45de-b074-f436935d28eb',
    name: 'Abie Stickney',
  },
  {
    id: '9ac1c4e4-5296-484a-9232-530621200f69',
    name: 'Edna Chadband',
  },
  {
    id: '6b575e69-631b-4509-ae78-c28be4b50b8c',
    name: 'Roma Duran',
  },
  {
    id: '45fbe8f7-0c33-46d5-b327-37a1b9845da4',
    name: 'Red Reinhard',
  },
  {
    id: '0cb78ccc-d64d-47ee-b7f9-c4ff0f87fee9',
    name: 'Ricki Balint',
  },
  {
    id: '3e03149c-626f-4823-a802-24337007b9e0',
    name: 'Saul Simmon',
  },
  {
    id: 'a87cd5fa-22e9-4e3c-ade0-5deec09890d9',
    name: 'Jeane Snoxall',
  },
  {
    id: '3dca9e09-a160-4f44-85d5-1e65141ef07c',
    name: 'Gardy Beardsley',
  },
  {
    id: 'c8fd1f41-b2b5-4250-9929-8c8ab8c6d1f7',
    name: 'Lexine Cunniffe',
  },
  {
    id: '7158b449-5840-46a7-92db-cb475acd4d9f',
    name: 'Minor Parmiter',
  },
  {
    id: '2b754136-0ee2-4afb-b6bb-773d4fa85799',
    name: 'Dwayne Habbergham',
  },
  {
    id: 'da413a91-4da2-4a99-9396-2f4dc982da55',
    name: 'Trenna Savatier',
  },
  {
    id: 'f4a1230c-9b63-4f2e-8168-09fa42ef68e8',
    name: 'Robenia Guirardin',
  },
  {
    id: 'c5dcf6bf-822e-49ed-b936-e268ad88db5a',
    name: 'Edwina Prudham',
  },
  {
    id: '96997f16-c31b-47d3-bbf4-877a4647657a',
    name: 'Diane Welman',
  },
  {
    id: 'dad8d65b-be86-4dbe-93a7-ecd9df0a2a50',
    name: 'Elinor Tarren',
  },
  {
    id: '7293c163-7e3f-43d6-94d7-424ce5864ec5',
    name: 'Audrye Astupenas',
  },
  {
    id: '2289c552-794c-41e7-8405-a0cca34d84ed',
    name: 'Kirby Lortz',
  },
  {
    id: '6c04dcf3-9cb2-4e8f-a22f-691a0c4d6542',
    name: 'Ennis Mellers',
  },
  {
    id: '63ebedc8-9b1d-4972-a34f-a347ac94e684',
    name: 'Patrizius Griffen',
  },
  {
    id: '9878e21a-dc3a-4e2a-bc91-a6e0d4f57973',
    name: 'Devi Eastwood',
  },
  {
    id: 'b46b1abd-9532-47bd-888b-bdac90bd66ac',
    name: 'Erena Livzey',
  },
  {
    id: '34267519-04ce-427e-9768-c638429f0e13',
    name: 'Cornell Philpots',
  },
  {
    id: 'c1b48ea1-64d5-4a61-87c2-dd3075418fe8',
    name: 'Burtie Rossant',
  },
  {
    id: '12f14dac-3afc-4c52-b833-85ea9a9ea5e6',
    name: 'Winston Capnerhurst',
  },
  {
    id: '57bf5c8b-5bb9-46b6-9b04-c8aa6fea6976',
    name: 'Karissa Gergely',
  },
  {
    id: '2757a08a-f4fd-48fd-8526-7ac7b7931a71',
    name: 'Timmy Robrose',
  },
  {
    id: 'c3f8ceec-4939-4694-ae88-687ed5756b0c',
    name: 'Mark Baggelley',
  },
  {
    id: '48213ac6-ab56-47a4-9146-5aaa7bd989e0',
    name: 'Gerrie Hollibone',
  },
  {
    id: '866ad004-ccff-4e63-867e-47ecb62ff52f',
    name: 'Farrah Sivyer',
  },
  {
    id: '0496d237-cb0d-4ace-8104-6a56dea37747',
    name: 'Shaina Tabourel',
  },
  {
    id: '1d295a97-a0af-470c-b8a9-07f5dd6627f2',
    name: 'Lloyd Sprason',
  },
  {
    id: '4b77099d-0e77-4bd5-8ef1-2a97a2dcd6b7',
    name: 'Loralie Bisco',
  },
  {
    id: 'f0a1d123-0e9d-4f1c-86c0-74631f177ebc',
    name: 'Alic Basilone',
  },
  {
    id: 'ceb9f05f-4af8-47fc-acd2-020c7dcdf9d9',
    name: 'Sherm Flynn',
  },
  {
    id: '6e0e9788-6001-4f37-a6d6-c9ca30a7bc60',
    name: 'Cyndy Brellin',
  },
  {
    id: '22d24516-24a3-463f-a706-c52df5cb538d',
    name: 'Holmes MacCourt',
  },
  {
    id: '97833be6-9a29-46ad-ac76-48cf5ef8ff10',
    name: 'Charo Gorges',
  },
  {
    id: '725e188e-307a-4b64-bd0d-84be31d6e549',
    name: 'Melisandra Gaw',
  },
  {
    id: '27517802-2490-4125-ab57-a4066d2e5d2e',
    name: 'Drusie Timperley',
  },
  {
    id: '3d84f29b-c887-4ca1-9f37-acc157e3563a',
    name: 'Ferrell Ledwith',
  },
  {
    id: 'ee1f5b97-0ac2-4957-a24b-973f4edeaffb',
    name: 'Berte Fenners',
  },
  {
    id: '0e3245c7-5049-47fb-a33f-d4391e60f45e',
    name: 'Margeaux Abden',
  },
  {
    id: '87cd4f70-c3ec-42db-8c0c-541e27752015',
    name: 'Ransom Galler',
  },
  {
    id: '5bd0d1c1-30bc-479e-97c8-b41fb6331195',
    name: 'Elly Andreou',
  },
  {
    id: '3ace1ba1-1d79-4712-b200-5624d4872b3e',
    name: 'Warde McGowran',
  },
  {
    id: '69582463-8036-4516-a6fe-122f7c64ea33',
    name: 'Denny MacKay',
  },
  {
    id: 'c9a4e542-5120-49b9-955c-eeed21db58ba',
    name: 'Alia Gheeraert',
  },
  {
    id: '7b42373d-8a35-4c06-82cb-00ab64c2d040',
    name: 'Clarance Taye',
  },
  {
    id: 'ba10c0b5-bf2e-4d17-8fff-cc4dd892ffee',
    name: 'Nicol Richardes',
  },
  {
    id: 'eb5d1780-0373-4e5f-b4ce-90d4f5707185',
    name: 'Mair Hefferon',
  },
  {
    id: '549eff0b-6b4b-41d4-9839-bbf2c76c5da9',
    name: 'Jourdain Whatson',
  },
  {
    id: 'fc35d882-cc7d-49c4-af26-bc4cb627e489',
    name: 'Gaby Walsham',
  },
  {
    id: '2c96782e-069e-4e06-b1bf-dbbf79624f8d',
    name: 'Berti Wrettum',
  },
  {
    id: '5182a0a4-966f-4037-81bb-85d7f0667aa0',
    name: 'Basilio MacTeague',
  },
  {
    id: 'ab0f7fd7-99be-48d9-9c61-908c7417b9b1',
    name: 'Verina Osman',
  },
  {
    id: '87c4e90d-781b-41af-aa3c-1d08af796bbc',
    name: 'Tove Bolton',
  },
  {
    id: '8990c9e1-669b-4d16-8f27-c6c43f09bc06',
    name: 'Claudell Crevagh',
  },
  {
    id: 'bfdd92f3-7f54-458a-9efe-98927dc33419',
    name: 'Kristine Dyster',
  },
  {
    id: 'b3072a3c-8c98-4a18-b943-981c129a72b5',
    name: 'Berky Kaubisch',
  },
  {
    id: '481c4f06-003d-4f92-bb45-14e8c3272e10',
    name: 'Farrand Ladbury',
  },
  {
    id: '13c9e256-479b-4607-95d3-51047ba798b2',
    name: 'Laurette Trudgeon',
  },
  {
    id: 'ff859562-3f50-4dbb-b1e7-1e9a43ac4f2b',
    name: 'Jannelle Sher',
  },
  {
    id: 'a6036687-f44a-4607-8392-dbe984ab1891',
    name: 'Hedvige Childe',
  },
  {
    id: '626c014b-d7d3-4014-83a7-3e1e97dd1110',
    name: 'Madelina Stonary',
  },
  {
    id: '84263ac1-814d-4f03-894a-5dd9915b2332',
    name: 'Rhody Sudworth',
  },
  {
    id: 'f9b2d46b-7f33-4965-9b70-d8d0eea7262b',
    name: 'Tamara Druitt',
  },
  {
    id: '8f33de2a-c96c-46d4-ad4c-ac9bbfe46105',
    name: 'Boniface Quinney',
  },
  {
    id: '0416011d-fa81-45e8-af5c-316dc64fb910',
    name: 'Keefe Willgoss',
  },
  {
    id: '505d6ed5-a671-41ed-a231-4d2de517ce7c',
    name: 'Tamiko Giraudat',
  },
  {
    id: '2856d25d-eecb-43d6-9012-1d082cbe9393',
    name: 'Loralee Bohl',
  },
  {
    id: 'f9106749-d425-4b7c-b7dc-d58cee3d8bc7',
    name: 'Talia Roderick',
  },
  {
    id: 'd6960cd7-e22e-4b4f-8f87-ca53fe47772c',
    name: 'Tish Greenleaf',
  },
  {
    id: 'e11dbba8-cdde-441d-8364-b45b6426a521',
    name: 'Essie Garr',
  },
  {
    id: '46a81c2b-575c-47ab-93ef-767ae07da7a8',
    name: 'Nial Sandeman',
  },
  {
    id: '9b500565-5992-4df0-a1da-105112218c5d',
    name: 'Paddie McKomb',
  },
  {
    id: 'f2e495e7-29cb-4cd7-90ef-f71fa5562f48',
    name: 'Lynett Alennikov',
  },
  {
    id: 'b7a3d207-8f1f-4bfd-93f5-a040b56aa3e0',
    name: 'Freedman Billes',
  },
  {
    id: '44d658a2-d3c5-4378-a24c-ee042731fc44',
    name: 'Ban Minger',
  },
  {
    id: '11778391-2c7c-4f82-a32c-08c0d13da7f6',
    name: 'Jeth Vanderson',
  },
  {
    id: '43f990fa-0c35-454a-a84e-3470f8919e64',
    name: 'Brew Weeke',
  },
  {
    id: '1e8f318a-1058-49b4-9033-5fc0f0f16dbf',
    name: 'Leone Harnes',
  },
  {
    id: '9b247d84-5cc4-4922-9a5f-f961e773e3a0',
    name: 'Sigrid Dabbs',
  },
  {
    id: '14ff23ee-a6b5-42c5-bf71-c39fef07ec85',
    name: 'Verina Pastor',
  },
  {
    id: '33fcd6ad-cf72-4423-8447-e66114afc176',
    name: 'Loleta Voden',
  },
  {
    id: '59c8d7ca-8454-4a3d-aeba-52d999fb4904',
    name: 'Cassandry Towsie',
  },
  {
    id: '968ff78c-02aa-43a8-84a9-1bb4512782cd',
    name: 'Barrett Cockshoot',
  },
  {
    id: 'bb78145e-fce9-4d70-8c43-253fe5208ac3',
    name: 'Mattie Woodroff',
  },
  {
    id: '30cf4be1-5317-483e-ad28-60df459b6247',
    name: 'Mara McDade',
  },
  {
    id: '13005774-8cde-4fb5-af8e-80eab3732c43',
    name: 'Jackqueline Summerscales',
  },
  {
    id: '03dabf50-d85b-4efb-b90f-579ba8b258b8',
    name: 'Rodolfo Stud',
  },
  {
    id: '69d3577f-4b55-488d-9eb5-8f65d8e4c827',
    name: 'Abel Hallagan',
  },
  {
    id: '4fa8a809-3517-4a47-977d-12edf267e57d',
    name: 'Gabi Gensavage',
  },
  {
    id: 'd7e45935-a794-48bc-b3c3-1088e1044794',
    name: 'Tallie Bryson',
  },
  {
    id: '4e23f5e8-b7a6-4ea8-baf0-0b5c45fa5981',
    name: 'Minne Roglieri',
  },
  {
    id: 'b1516962-0d7f-4e73-9fa2-30807a541139',
    name: 'Perry Lansberry',
  },
  {
    id: '25fcf879-73a2-4d4f-8bcd-402ef8674111',
    name: 'Joshua Marciskewski',
  },
  {
    id: 'e215a870-d9b0-41b7-b160-f2452fe6915e',
    name: 'Elsi Wiggin',
  },
];

function delay() {
  return new Promise<{ id: string; name: string }[]>((resolve) => {
    setTimeout(() => resolve(USER_LIST), 1000);
  });
}

export function useUsersOptionSource() {
  return useMemo(
    () =>
      createEntireLoadOptionSource({
        fn: () => delay().then((users) => users.map((x) => ({ id: x.id, name: x.name }))),
        labelBy: 'name',
        valueBy: 'id',
      }),
    [],
  );
}
