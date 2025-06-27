import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Posyandu " description="Bungung Barana Selatan">
            <Head title="Log in" />

            <div className="mx-auto w-full max-w-md space-y-6">
                {status && (
                    <div className="rounded-md bg-green-50 p-4">
                        <p className="text-center text-sm font-medium text-green-800">{status}</p>
                    </div>
                )}

                <div className="rounded-lg border bg-card p-8 shadow-sm">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Masuk Akun</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Masukkan email dan password Anda untuk mengakses akun Anda
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={submit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="your@email.com"
                                className="h-10"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-xs font-medium"
                                        tabIndex={5}
                                    >
                                        Lupa Password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="h-10"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-medium leading-none">
                                    Ingat Saya
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            tabIndex={4}
                            disabled={processing}
                            size="lg"
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </form>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Belum Punya Akun?{' '}
                    <TextLink
                        href={route('register')}
                        className="font-medium text-primary hover:underline"
                        tabIndex={5}
                    >
                        Buat Akun
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
