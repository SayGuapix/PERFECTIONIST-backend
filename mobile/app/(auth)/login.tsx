import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Paragraph, Text, YStack } from "tamagui";
import { Screen } from "@/ui/components/screen";
import { useLogin } from "@/features/auth/hooks";

const schema = z.object({
  email: z.email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const mutation = useLogin();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      router.replace("/(tabs)/dashboard");
    } catch {
      // React Query exposes the message through mutation.error.
    }
  });

  return (
    <Screen>
      <YStack gap="$3" marginTop="$8">
        <Text fontSize="$9" fontWeight="700">
          Bienvenido
        </Text>
        <Paragraph color="$gray10">Inicia sesion para continuar.</Paragraph>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              placeholder="Correo"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              placeholder="Contrasena"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Button onPress={onSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
        {mutation.error ? (
          <Paragraph color="$red10">{mutation.error.message}</Paragraph>
        ) : null}
        <Link href="/(auth)/register" asChild>
          <Button chromeless>Crear cuenta</Button>
        </Link>
      </YStack>
    </Screen>
  );
}
