import React, { ElementType } from 'react';

type CardStatusProps = {
  colorFondoBorde: string;
  titulo: string;
  cantidad: string;
  icon: ElementType;
  colorIcon: string;
};

export default function CardStatus({
  colorFondoBorde,
  titulo,
  cantidad,
  icon: Icon,
  colorIcon,
}: CardStatusProps) {
  return (
    <div
      className={`w-full flex items-center p-4 sm:p-6 border-l-[10px] sm:border-l-[20px] ${colorFondoBorde} rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center w-full">
        {/* Icono */}
        <div className="text-3xl sm:text-5xl">
          <Icon className={`${colorIcon}`} />
        </div>
        {/* Texto y cantidad */}
        <div className="flex flex-col items-start sm:items-end ml-4 sm:ml-auto pl-2 sm:pl-6">
          <h2 className="font-bold text-xs sm:text-sm uppercase text-gray-500">{titulo}</h2>
          <p className="font-bold text-2xl sm:text-4xl text-gray-900">{cantidad}</p>
        </div>
      </div>
    </div>
  );
}
