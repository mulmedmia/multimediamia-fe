import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StarIcon } from '@radix-ui/react-icons';

const PrizeSection = () => {
  const prizes = [
    {
      category: "Website Development",
      total: "Rp 15.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 8.000.000", icon: "🥇" },
        { place: "Juara 2", amount: "Rp 4.000.000", icon: "🥈" },
        { place: "Juara 3", amount: "Rp 3.000.000", icon: "🥉" },
      ],
    },
    {
      category: "UI/UX Design",
      total: "Rp 12.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 6.000.000", icon: "🥇" },
        { place: "Juara 2", amount: "Rp 3.500.000", icon: "🥈" },
        { place: "Juara 3", amount: "Rp 2.500.000", icon: "🥉" },
      ],
    },
    {
      category: "Digital Poster",
      total: "Rp 10.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 5.000.000", icon: "🥇" },
        { place: "Juara 2", amount: "Rp 3.000.000", icon: "🥈" },
        { place: "Juara 3", amount: "Rp 2.000.000", icon: "🥉" },
      ],
    },
    {
      category: "Essay Writing",
      total: "Rp 10.000.000",
      awards: [
        { place: "Juara 1", amount: "Rp 5.000.000", icon: "🥇" },
        { place: "Juara 2", amount: "Rp 3.000.000", icon: "🥈" },
        { place: "Juara 3", amount: "Rp 2.000.000", icon: "🥉" },
      ],
    },
  ];

  return (
    <section
      id="hadiah"
      className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-black"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 mb-4 px-4 py-2 shadow-lg">
            <StarIcon className="h-4 w-4 mr-2" />
            Total Hadiah 47 Juta Rupiah
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-3">
            Hadiah Menarik Menanti
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Raih kesempatan memenangkan hadiah puluhan juta rupiah dan pengakuan
            nasional.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((prize, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-white to-gray-50 dark:bg-black/50 border dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg font-bold text-foreground dark:text-white">
                  {prize.category}
                </CardTitle>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {prize.total}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {prize.awards.map((award, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between p-3 bg-background/50 dark:bg-gray-900/70 rounded-lg shadow-sm border dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{award.icon}</span>
                      <span className="text-sm text-foreground dark:text-white font-semibold">
                        {award.place}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {award.amount}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrizeSection;