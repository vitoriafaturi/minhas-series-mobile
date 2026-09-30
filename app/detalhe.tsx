import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { deleteSerie, getSerieById, toggleSerieConcluida } from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function Detalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serieId = Number(id);

  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    const dados = await getSerieById(serieId);
    setSerie(dados);
    setCarregando(false);
  }, [serieId]);

  // useFocusEffect (e não useEffect): ao voltar do form de edição,
  // esta tela estava só "embaixo" na pilha e precisa recarregar os dados
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function alternarConcluida() {
    await toggleSerieConcluida(serieId);
    await carregar();
  }

  function confirmarExclusao() {
    if (!serie) return;
    Alert.alert('Excluir série', `Tem certeza que deseja excluir "${serie.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteSerie(serieId);
          router.back();
        },
      },
    ]);
  }

  if (carregando) {
    return <View className="flex-1 bg-fundo" />;
  }

  if (!serie) {
    return (
      <View className="flex-1 items-center justify-center bg-fundo px-4">
        <Text className="text-lg font-semibold text-neutral-300">Série não encontrada</Text>
      </View>
    );
  }

  const concluida = serie.concluida === 1;
  const cadastradaEm = new Date(serie.createdAt).toLocaleDateString('pt-BR');

  return (
    <ScrollView className="flex-1 bg-fundo" contentContainerClassName="gap-4 p-4">
      <View
        className={`rounded-xl border p-5 ${
          concluida ? 'border-rosa/60 bg-concluida' : 'border-borda bg-campo'
        }`}
      >
        <Text className={`text-2xl font-bold ${concluida ? 'text-rosa' : 'text-neutral-50'}`}>
          {serie.titulo}
        </Text>
        <Text
          className={`mt-2 self-start rounded-full px-3 py-1 text-xs font-bold ${
            concluida ? 'bg-rosa text-white' : 'bg-borda text-neutral-200'
          }`}
        >
          {concluida ? '✓ Concluída' : '▶ Assistindo'}
        </Text>

        <View className="mt-4 gap-3">
          <Info rotulo="Plataforma" valor={serie.plataforma} />
          <Info
            rotulo="Temporadas assistidas"
            valor={`${serie.temporadas} ${serie.temporadas === 1 ? 'temporada' : 'temporadas'}`}
          />
          <Info
            rotulo="Nota"
            valor={
              serie.nota !== null
                ? `${'★'.repeat(serie.nota)}${'☆'.repeat(5 - serie.nota)}  (${serie.nota}/5)`
                : 'Sem nota'
            }
          />
          <Info rotulo="Cadastrada em" valor={cadastradaEm} />
        </View>
      </View>

      <Pressable
        onPress={alternarConcluida}
        className="items-center rounded-xl bg-rosa py-4 active:bg-rosa-escuro"
      >
        <Text className="text-base font-bold text-white">
          {concluida ? 'Voltar para assistindo' : 'Marcar como concluída'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(`/form?id=${serie.id}`)}
        className="items-center rounded-xl border border-rosa py-4 active:bg-campo"
      >
        <Text className="text-base font-bold text-rosa">Editar</Text>
      </Pressable>

      <Pressable
        onPress={confirmarExclusao}
        className="items-center rounded-xl border border-red-400 py-4 active:bg-red-950/60"
      >
        <Text className="text-base font-bold text-red-400">Excluir</Text>
      </Pressable>
    </ScrollView>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View>
      <Text className="text-sm text-neutral-400">{rotulo}</Text>
      <Text className="text-base text-neutral-100">{valor}</Text>
    </View>
  );
}
