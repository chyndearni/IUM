import { Clock, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    description: string;
    requirements: string[];
    accessibility?: string;
    logo: string;
  };
  urlLamar?: string;
  urlDetail?: string;
}

export default function JobCard({ job, urlLamar, urlDetail }: JobCardProps) {
  // Generate accessibility description
  const accessibilityDescription = `Lowongan kerja ${job.title} di ${
    job.company
  }, lokasi ${job.location}, gaji ${job.salary}, jenis ${job.type}, diposting ${
    job.posted
  }. Deskripsi: ${
    job.description
  }. Keahlian yang dibutuhkan: ${job.requirements.join(", ")}.`;

  return (
    <article
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
      aria-label={`Kartu lowongan kerja: ${job.title} di ${job.company}`}
      role="article"
      tabIndex={0}
    >
      {/* Hidden accessibility description for screen readers */}
      <div className="sr-only" aria-hidden="false">
        {accessibilityDescription}
      </div>

      {/* Content Container - akan mengambil ruang yang tersedia */}
      <div className="flex-1">
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={job.logo}
              alt={`Logo perusahaan ${job.company}`}
              className="w-12 h-12 rounded-lg object-cover"
              role="img"
              aria-label={`Logo ${job.company}`}
            />
            <div>
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-white"
                aria-label={`Posisi: ${job.title}`}
              >
                {job.title}
              </h3>
              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                aria-label={`Perusahaan: ${job.company}`}
              >
                {job.company}
              </p>
            </div>
          </div>
          <time
            className="text-xs text-gray-500 dark:text-gray-400"
            aria-label={`Diposting: ${job.posted}`}
            dateTime={job.posted}
          >
            {job.posted}
          </time>
        </header>

        {/* Description */}
        <section aria-labelledby="job-description">
          <h4 id="job-description" className="sr-only">
            Deskripsi Pekerjaan
          </h4>
          <p
            className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3"
            aria-label={`Deskripsi pekerjaan: ${job.description}`}
          >
            {job.description}
          </p>
        </section>

        {/* Job Details */}
        <section aria-labelledby="job-details" className="space-y-2 mb-4">
          <h4 id="job-details" className="sr-only">
            Detail Pekerjaan
          </h4>

          <div
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
            aria-label={`Lokasi kerja: ${job.location}`}
          >
            <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
            <span aria-label={`Lokasi ${job.location}`}>{job.location}</span>
          </div>

          <div
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
            aria-label={`Gaji atau kompensasi: ${job.salary}`}
          >
            <DollarSign className="w-4 h-4 mr-2" aria-hidden="true" />
            <span aria-label={`Gaji ${job.salary}`}>{job.salary}</span>
          </div>

          <div
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
            aria-label={`Jenis pekerjaan: ${job.type}`}
          >
            <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
            <span aria-label={`Jenis pekerjaan ${job.type}`}>{job.type}</span>
          </div>
        </section>

        {/* Requirements */}
        <section aria-labelledby="job-requirements" className="mb-4">
          <h4 id="job-requirements" className="sr-only">
            Keahlian yang Dibutuhkan
          </h4>
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label={`Keahlian yang dibutuhkan: ${job.requirements.join(
              ", "
            )}`}
          >
            {job.requirements &&
              job.requirements.map((req: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                  role="listitem"
                  aria-label={`Keahlian: ${req}`}
                >
                  {req}
                </span>
              ))}
          </div>
        </section>
      </div>

      {/* Actions - akan selalu berada di bawah */}
      <footer
        className="flex space-x-3 mt-auto"
        role="group"
        aria-label="Aksi untuk lowongan ini"
      >
        <Link
          href={urlLamar || ""}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-center text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label={`Lamar sekarang untuk posisi ${job.title} di ${job.company}`}
          role="button"
        >
          Lamar Sekarang
        </Link>

        <Link
          href={urlDetail || ""}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label={`Lihat detail lengkap lowongan ${job.title} di ${job.company}`}
          role="button"
        >
          Detail
        </Link>
      </footer>
    </article>
  );
}
