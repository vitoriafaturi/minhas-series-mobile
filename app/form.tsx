import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';

import { createSerie, getSerieById, updateSerie } from '../src/database/serieRepository';

export default function Form() {
 
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;
  const editando = serieId !== null;

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState(''); 
  const [nota, setNota] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Modo edição: carrega a série e preenche os campos
  useEffect(() => {
    if (serieId === null) return;

    async function carregar(idSerie: number) {
      const serie = await getSerieById(idSerie);
      if (!serie) {
        setErro('Série não encontrada.');
        return;
      }
      setTitulo(serie.titulo);
      setPlataforma(serie.plataforma);
      setTemporadas(String(serie.temporadas));
      setNota(serie.nota);
    }
    carregar(serieId);
  }, [serieId]);

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasNumero = Number(temporadas.trim());

    if (!tituloLimpo || !plataformaLimpa) {
      setErro('Preencha o título e a plataforma.');
      return;
    }
    
    if (temporadas.trim() === '' || !Number.isInteger(temporadasNumero) || temporadasNumero < 0) {
      setErro('Temporadas precisa ser um número inteiro maior ou igual a 0.');
      return;
    }

    setErro(null);
    setSalvando(true);
    const dados = {
      titulo: tituloLimpo,
      plataforma: plataformaLimpa,
      temporadas: temporadasNumero,
      nota,
    };

    try {
      if (serieId !== null) {
        await updateSerie(serieId, dados);
      } else {
        await createSerie(dados);
      }
      router.back();
    } catch {
      setErro('Não foi possível salvar. Tente de novo.');
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-800"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />

      <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
        <Campo rotulo="Título">
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex.: Dark"
            placeholderTextColor="#737373"
            className="rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-base text-neutral-50"
          />
        </Campo>

        <Campo rotulo="Plataforma">
          <TextInput
            value={plataforma}
            onChangeText={setPlataforma}
            placeholder="Ex.: Netflix, Max, Prime Video"
            placeholderTextColor="#737373"
            className="rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-base text-neutral-50"
          />
        </Campo>

        <Campo rotulo="Temporadas assistidas">
          <TextInput
            value={temporadas}
            onChangeText={setTemporadas}
            placeholder="0"
            placeholderTextColor="#737373"
            keyboardType="numeric"
            className="rounded-xl border border-neutral-600 bg-neutral-700 px-4 py-3 text-base text-neutral-50"
          />
        </Campo>

        <Campo rotulo="Nota">
          <SeletorNota nota={nota} onChange={setNota} />
          <Text className="mt-1 text-neutral-400">
            {nota !== null ? `${nota} de 5 — toque de novo para tirar a nota` : 'Sem nota'}
          </Text>
        </Campo>

        {erro && (
          <Text className="rounded-xl bg-red-950/60 px-4 py-3 text-red-300">{erro}</Text>
        )}

        <Pressable
          onPress={salvar}
          disabled={salvando}
          className={`mt-2 items-center rounded-xl py-4 ${
            salvando ? 'bg-pink-200/50' : 'bg-pink-200 active:bg-pink-300'
          }`}
        >
          <Text className="text-base font-bold text-neutral-900">
            {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar série'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <View>
      <Text className="mb-2 font-semibold text-neutral-300">{rotulo}</Text>
      {children}
    </View>
  );
}

function SeletorNota({ nota, onChange }: { nota: number | null; onChange: (nota: number | null) => void }) {
  return (
    <View className="flex-row gap-2">
      {[1, 2, 3, 4, 5].map((valor) => {
        const acesa = nota !== null && valor <= nota;
        return (
          <Pressable
            key={valor}
            // Tocar na nota já selecionada remove a nota
            onPress={() => onChange(nota === valor ? null : valor)}
            className={`flex-1 items-center rounded-xl border py-2 ${
              acesa ? 'border-pink-200 bg-pink-200' : 'border-neutral-600 bg-neutral-700'
            }`}
          >
            <Text className={`text-lg font-bold ${acesa ? 'text-neutral-900' : 'text-neutral-400'}`}>
              ★ {valor}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
