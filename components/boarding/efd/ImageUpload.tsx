// components/ImageUpload.tsx
"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";

export default function ImageUpload({ image }: { image?: string | null }) {
  const [imageUrl, setImageUrl] = useState(image || "");

  return (
    <CldUploadWidget
      onSuccess={(result, { widget }) => {
        if (result.event === "success") {
          widget.close();
          //@ts-expect-error Esto es necesario porque 'result.info' puede no estar presente o tener un tipo desconocido
          setImageUrl(result.info?.secure_url);
        }
      }}
      uploadPreset="boarding"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => (
        <>
          <div className="space-y-2 text-center mt-5">
            <label className="text-slate-800 font-semibold">Fotografia del EFD</label>
            <div
              className="relative cursor-pointer hover:opacity-70 transition p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 bg-slate-100"
              onClick={() => open()}
            >
              <TbPhotoPlus size={50} />
              <p className="text-lg font-semibold">Agregar Imagen</p>
              {imageUrl && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    fill
                    style={{ objectFit: "contain" }}
                    src={imageUrl}
                    alt="Imagen"
                  />
                </div>
              )}
            </div>
          </div>

          {image && !imageUrl && (
            <div className="space-y-2">
              <label>Imagen Actual:</label>
              <div className="relative w-64 h-64">
                <Image
                  fill
                  src={image}
                  alt="Imagen"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          )}

          <input
            type="hidden"
            name="image"
            defaultValue={imageUrl ?? image ?? ''}
          />
        </>
      )}
    </CldUploadWidget>
  );
}
