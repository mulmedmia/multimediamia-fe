import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PersonIcon } from '@radix-ui/react-icons';

const JudgesSection = () => {
  const judges = [
    {
      name: "Laura Chen",
      title: "Design Lead at InnovateX",
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "David Lee",
      title: "Senior Developer at TechGenius",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Maria Garcia",
      title: "Creative Director, Artsy Inc.",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      name: "Samuel Green",
      title: "Content Strategist, NarrateCo",
      image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  return (
    <section id="juri" className="py-20 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
          >
            <PersonIcon className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            Dewan Juri
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white mb-4">
            Dinilai oleh Para Ahli
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Karya Anda akan dievaluasi oleh para profesional berpengalaman di
            bidangnya masing-masing.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {judges.map((judge, i) => (
            <div key={i} className="text-center group">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={judge.image}
                  alt={judge.name}
                  fill
                  className="object-cover rounded-full shadow-lg border-4 border-transparent group-hover:border-red-500 transition-all duration-300 transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground dark:text-white">
                {judge.name}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {judge.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JudgesSection