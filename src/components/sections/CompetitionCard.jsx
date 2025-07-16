import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const CompetitionCard = ({
  icon,
  title,
  description,
  prize,
  requirements,
  color,
  deadline,
  participants,
  difficulty,
  href,
}) => {
  return (
    <Link href={href} legacyBehavior>
      <a className="block">
    <Card className="relative flex flex-col overflow-hidden rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full bg-card dark:bg-gray-900/50 border dark:border-gray-800">
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-foreground dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>
      <div className="space-y-2 mb-4 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            Hadiah Utama
          </span>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {prize}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            Deadline
          </span>
          <Badge variant="destructive">{deadline}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            Peserta
          </span>
          <Badge variant="secondary">{participants}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            Tingkat
          </span>
          <Badge variant="outline">{difficulty}</Badge>
        </div>
      </div>
      <div className="mb-4 flex-1">
        <h4 className="text-xs font-semibold text-foreground dark:text-white mb-2">
          Persyaratan:
        </h4>
        <ul className="text-xs text-muted-foreground dark:text-gray-400 space-y-1">
          {requirements.slice(0, 2).map((req, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircledIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{req}</span>
            </li>
          ))}
          {requirements.length > 2 && (
            <li className="text-xs text-gray-500 italic">
              +{requirements.length - 2} lainnya
            </li>
          )}
        </ul>
      </div>
      <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 dark:to-black hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg text-white">
        <span>Daftar Sekarang</span>
        <ArrowRightIcon className="h-3 w-3 ml-2" />
      </Button>
    </Card>
    </a>
    </Link>
  );
};

export default CompetitionCard;