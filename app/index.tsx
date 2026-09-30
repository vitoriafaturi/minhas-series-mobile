import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { getSeries } from '../src/database/serieRepository';
import type { Serie, SerieFilter } from '../src/types/serie';

const FILTROS: { valor: SerieFilter; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

export default function Index() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  // Roda toda vez que a tela ganha foco e tambem quando o filtro muda porque `filtro` está nas dependencias
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const dados = await getSeries(filtro);
        setSeries(dados);
      }
      carregar();
    }, [filtro])
  );

  return (
    <View className="flex-1 bg-neutral-800 px-4 pt-4">
      <View className="mb-4 flex-row gap-2">
        {FILTROS.map((f) => {
          const ativo = f.valor === filtro;
          return (
            <Pressable
              key={f.valor}
              onPress={() => setFiltro(f.valor)}
              className={`flex-1 items-center rounded-full border py-2 ${
                ativo ? 'border-pink-200 bg-pink-200' : 'border-neutral-500 bg-neutral-700'
              }`}
            >
              <Text className={`font-semibold ${ativo ? 'text-neutral-900' : 'text-neutral-300'}`}>
                {f.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-3 pb-24"
        renderItem={({ item }) => <SerieCard serie={item} />}
        ListEmptyComponent={
          <View className="mt-16 items-center">
            <Text className="text-lg font-semibold text-neutral-300">Nenhuma série por aqui</Text>
            <Text className="mt-1 text-neutral-400">Toque em "+ Nova série" para cadastrar.</Text>
          </View>
        }
      />

      <Pressable
        onPress={() => router.push('/form')}
        className="absolute bottom-6 left-4 right-4 items-center rounded-xl bg-pink-200 py-4 active:bg-pink-300"
      >
        <Text className="text-base font-bold text-neutral-900">+ Nova série</Text>
      </Pressable>
    </View>
  );
}

function SerieCard({ serie }: { serie: Serie }) {
  const concluida = serie.concluida === 1;

  return (
    <Pressable
      onPress={() => router.push(`/detalhe?id=${serie.id}`)}
      className={`rounded-xl border p-4 ${
        concluida ? 'border-pink-300/60 bg-pink-950/50' : 'border-neutral-600 bg-neutral-700'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`flex-1 text-lg font-bold ${concluida ? 'text-pink-200' : 'text-neutral-50'}`}
          numberOfLines={1}
        >
          {serie.titulo}
        </Text>
        {concluida && (
          <Text className="ml-2 rounded-full bg-pink-200 px-2 py-0.5 text-xs font-bold text-neutral-900">
            ✓ Concluída
          </Text>
        )}
      </View>

      <Text className="mt-1 text-neutral-400">
        {serie.plataforma} · {serie.temporadas}{' '}
        {serie.temporadas === 1 ? 'temporada' : 'temporadas'}
      </Text>

      <Text className="mt-2 text-amber-400">
        {serie.nota !== null ? '★'.repeat(serie.nota) + '☆'.repeat(5 - serie.nota) : 'Sem nota'}
      </Text>
    </Pressable>
  );
}
