"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, Award, Star, BookOpen, Users, Gift, CheckCircle } from 'lucide-react';
import { SubmissionForm } from "@/components/forms/SubmissionForm";

import { getSubmissionsByCategoryId } from '@/services/submission.service';
import { getCompetitionSchedule, getLeaderboard } from '@/services/competition.service';
import { getGamificationData, redeemPoints } from '@/services/gamification.service';

export function CompetitionDashboard({ registration }) {
    const [activeTab, setActiveTab] = useState("beranda");
    const queryClient = useQueryClient();

    const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
        queryKey: ['submissions', registration.category.category_id],
        queryFn: () => getSubmissionsByCategoryId(registration.category.category_id),
        enabled: !!registration.category.category_id,
    });

    const { data: gamificationData, isLoading: isLoadingGamification } = useQuery({
        queryKey: ['gamification', registration.registration_id],
        queryFn: () => getGamificationData(registration.registration_id),
        enabled: !!registration.registration_id,
    });

    const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
        queryKey: ['schedule', registration.category.category_id],
        queryFn: () => getCompetitionSchedule(registration.category.category_id),
        enabled: !!registration.category.category_id,
        placeholderData: []
    });
    
    const { data: leaderboard, isLoading: isLoadingLeaderboard } = useQuery({
        queryKey: ['leaderboard', registration.category.category_id],
        queryFn: () => getLeaderboard(registration.category.category_id),
        enabled: !!registration.category.category_id,
        placeholderData: []
    });

    const redeemMutation = useMutation({
        mutationFn: redeemPoints,
        onSuccess: () => {
            alert("Hadiah berhasil ditukar!");
            queryClient.invalidateQueries({ queryKey: ['gamification', registration.registration_id] });
        },
        onError: (error) => {
            alert("Gagal menukar poin: " + (error.message || "Terjadi kesalahan"));
        }
    });

    const handleRedeem = (itemId) => {
        redeemMutation.mutate(itemId);
    };
    
    const progressValue = submissions?.length > 0 ? (submissions.filter(s => s.status === 'Dinilai').length / 3) * 100 : 0;

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{registration.category.name}</h2>
                    <p className="text-muted-foreground">Selamat berkompetisi, Tim {registration.team_name}!</p>
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
                    <TabsTrigger value="beranda"><Star className="mr-1 h-4 w-4" />Beranda</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="mr-1 h-4 w-4" />Upload</TabsTrigger>
                    <TabsTrigger value="status"><Award className="mr-1 h-4 w-4" />Status</TabsTrigger>
                    <TabsTrigger value="jadwal"><Calendar className="mr-1 h-4 w-4" />Jadwal</TabsTrigger>
                    <TabsTrigger value="gamifikasi"><Star className="mr-1 h-4 w-4" />Misi</TabsTrigger>
                    <TabsTrigger value="leaderboard"><Users className="mr-1 h-4 w-4" />Peringkat</TabsTrigger>
                    <TabsTrigger value="mentoring"><BookOpen className="mr-1 h-4 w-4" />Mentoring</TabsTrigger>
                </TabsList>

                <TabsContent value="beranda">
                    <Card><CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
                        <div><p className="font-medium">Progress Kompetisi</p><Progress value={progressValue} className="w-full mt-2" /></div>
                        <div><p className="font-medium">Total Poin Anda</p><p className="text-2xl font-bold">{isLoadingGamification ? 'Memuat...' : `${gamificationData.points} Poin`}</p></div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="upload">
                    <Card><CardHeader><CardTitle>Upload Karya</CardTitle><CardDescription>Unggah atau perbarui karya Anda sesuai fase kompetisi.</CardDescription></CardHeader><CardContent><SubmissionForm registrationId={registration.registration_id} onSuccess={() => { alert('Karya berhasil diunggah!'); setActiveTab('status'); queryClient.invalidateQueries(['submissions', registration.category.category_id]); }}/></CardContent></Card>
                </TabsContent>

                <TabsContent value="status">
                     <Card>
                        <CardHeader><CardTitle>Status Submission & Feedback</CardTitle></CardHeader>
                        <CardContent>
                            {isLoadingSubmissions ? <p>Memuat data submission...</p> : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Fase</TableHead><TableHead>Judul</TableHead><TableHead>Tgl Upload</TableHead><TableHead>Status</TableHead><TableHead>Skor</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {submissions?.length > 0 ? submissions.map((sub) => (
                                            <TableRow key={sub.submission_id}>
                                                <TableCell><Badge>{sub.phase}</Badge></TableCell>
                                                <TableCell>{sub.title}</TableCell>
                                                <TableCell>{new Date(sub.created_at).toLocaleString('id-ID')}</TableCell>
                                                <TableCell><Badge variant="outline">{sub.status}</Badge></TableCell>
                                                <TableCell>{sub.score ?? '-'}</TableCell>
                                            </TableRow>
                                        )) : <TableRow><TableCell colSpan="5" className="text-center">Belum ada karya yang diunggah.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="jadwal">
                     <Card>
                        <CardHeader><CardTitle>Jadwal & Deadline Penting</CardTitle></CardHeader>
                        <CardContent>
                            {isLoadingSchedule ? <p>Memuat jadwal...</p> : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Aktivitas</TableHead><TableHead>Fase</TableHead><TableHead className="text-right">Tanggal</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {schedule.map((item) => (
                                            <TableRow key={item.schedule_id}>
                                                <TableCell className="font-medium">{item.activity}</TableCell>
                                                <TableCell><Badge variant="outline">{item.phase}</Badge></TableCell>
                                                <TableCell className="text-right">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="gamifikasi" className="grid gap-4 md:grid-cols-2">
                     <Card>
                        <CardHeader><CardTitle>Misi Tersedia</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {isLoadingGamification ? <p>Memuat misi...</p> : gamificationData.missions.map(mission => (
                                <div key={mission.mission_id} className={`flex items-center justify-between p-3 rounded-lg ${mission.isCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted/50'}`}>
                                    <div>
                                        <p className={`font-semibold ${mission.isCompleted ? 'line-through text-muted-foreground' : ''}`}>{mission.title}</p>
                                        <p className="text-sm text-yellow-500">+{mission.points} Poin</p>
                                    </div>
                                    {mission.isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Tukar Poin (Redeem)</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                           {isLoadingGamification ? <p>Memuat hadiah...</p> : gamificationData.redeemItems.map(item => (
                               <div key={item.item_id} className="flex items-center justify-between p-3 border rounded-lg">
                                   <div><p className="font-semibold">{item.name}</p><p className="text-sm text-yellow-500">{item.cost} Poin</p></div>
                                   <Button size="sm" onClick={() => handleRedeem(item.item_id)} disabled={gamificationData.points < item.cost || redeemMutation.isPending}>
                                        {redeemMutation.isPending ? 'Memproses...' : <><Gift className="mr-2 h-4 w-4" /> Tukar</>}
                                   </Button>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="leaderboard">
                     <Card>
                        <CardHeader><CardTitle>Peringkat Sementara</CardTitle><CardDescription>Posisi tim Anda di kategori {registration.category.name}</CardDescription></CardHeader>
                        <CardContent>
                           {isLoadingLeaderboard ? <p>Memuat peringkat...</p> : (
                               <Table>
                                    <TableHeader><TableRow><TableHead className="w-[80px]">Peringkat</TableHead><TableHead>Nama Tim</TableHead><TableHead className="text-right">Poin</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {leaderboard.map((team) => (
                                            <TableRow key={team.rank} className={team.team_name === registration.team_name ? 'bg-primary/10' : ''}>
                                                <TableCell className="font-bold text-lg">{team.rank}</TableCell>
                                                <TableCell className="font-medium">{team.team_name}</TableCell>
                                                <TableCell className="text-right font-semibold">{team.points}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                           )}
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="mentoring">
                     <Card><CardHeader><CardTitle>Riwayat Mentoring</CardTitle></CardHeader><CardContent><p className="text-center text-muted-foreground">Fitur ini akan segera tersedia.</p></CardContent></Card>
                 </TabsContent>
            </Tabs>
        </div>
    );
}
