import React from 'react';

/**
 * Primitives Skeleton avec animation shimmer/pulse pour remplacer tout loader générique.
 */
export const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-slate-200/80 animate-pulse rounded-xl ${className}`} />
);

/**
 * Skeleton fidèle à la page d'accueil (Bannière + Cartes Candidats).
 */
export const HomeSkeleton = () => (
  <div className="space-y-10 animate-fade-in pb-16">
    {/* Bannière Skeleton */}
    <div className="bg-gradient-to-b from-surface-subtle to-surface-base border-b border-surface-border py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <SkeletonBox className="h-10 w-3/4 mx-auto rounded-2xl" />
        <SkeletonBox className="h-4 w-1/2 mx-auto rounded-lg" />
        <SkeletonBox className="h-4 w-2/5 mx-auto rounded-lg" />
        <div className="pt-2 flex justify-center">
          <SkeletonBox className="h-12 w-64 rounded-2xl" />
        </div>
      </div>
    </div>

    {/* Section Candidats Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-surface-border">
        <div className="space-y-2">
          <SkeletonBox className="h-7 w-48 rounded-xl" />
          <SkeletonBox className="h-4 w-72 rounded-lg" />
        </div>
        <SkeletonBox className="h-9 w-28 rounded-xl" />
      </div>

      {/* Grille de 3 cartes de candidats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-6 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-5"
          >
            <div className="flex items-center gap-4">
              <SkeletonBox className="w-16 h-16 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <SkeletonBox className="h-5 w-3/4 rounded-lg" />
                <SkeletonBox className="h-4 w-1/2 rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonBox className="h-3 w-full rounded" />
              <SkeletonBox className="h-3 w-5/6 rounded" />
              <SkeletonBox className="h-3 w-2/3 rounded" />
            </div>
            <SkeletonBox className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton fidèle à la page de résultats (Carte élection + Décompte).
 */
export const ResultsSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in pb-16">
    <div className="p-8 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-surface-border">
        <SkeletonBox className="h-8 w-64 rounded-xl" />
        <SkeletonBox className="h-6 w-32 rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full rounded" />
        <SkeletonBox className="h-4 w-4/5 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <SkeletonBox className="h-20 rounded-xl" />
        <SkeletonBox className="h-20 rounded-xl" />
        <SkeletonBox className="h-20 rounded-xl" />
      </div>
    </div>

    <div className="text-center space-y-4 py-8">
      <SkeletonBox className="h-8 w-44 mx-auto rounded-full" />
      <SkeletonBox className="h-7 w-72 mx-auto rounded-xl" />
      <SkeletonBox className="h-4 w-96 mx-auto rounded-lg" />
    </div>
  </div>
);

/**
 * Skeleton pour le formulaire de candidature.
 */
export const ApplySkeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-fade-in pb-16">
    <div className="space-y-2">
      <SkeletonBox className="h-8 w-60 rounded-xl" />
      <SkeletonBox className="h-4 w-80 rounded-lg" />
    </div>
    <div className="p-8 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-6">
      <SkeletonBox className="h-12 w-full rounded-xl" />
      <SkeletonBox className="h-12 w-full rounded-xl" />
      <SkeletonBox className="h-12 w-full rounded-xl" />
      <SkeletonBox className="h-28 w-full rounded-xl" />
      <SkeletonBox className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

/**
 * Skeleton pour la modération des candidatures dans le back-office.
 */
export const AdminCandidatesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className="p-4 rounded-xl border border-surface-border bg-surface-base/60 space-y-3"
      >
        <div className="flex items-start gap-3">
          <SkeletonBox className="w-16 h-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-4 w-32 rounded" />
              <SkeletonBox className="h-4 w-16 rounded-full" />
            </div>
            <SkeletonBox className="h-3 w-24 rounded" />
            <SkeletonBox className="h-3 w-28 rounded" />
          </div>
        </div>
        <SkeletonBox className="h-14 w-full rounded-lg" />
        <div className="flex justify-end gap-2 pt-1">
          <SkeletonBox className="h-8 w-20 rounded-xl" />
          <SkeletonBox className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton pour les lignes du registre d'émargement des électeurs.
 */
export const AdminVotersSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((n) => (
      <tr key={n} className="animate-pulse border-b border-surface-border/50">
        <td className="px-4 py-3.5">
          <SkeletonBox className="h-4 w-28 rounded" />
        </td>
        <td className="px-4 py-3.5">
          <SkeletonBox className="h-5 w-20 rounded-full" />
        </td>
        <td className="px-4 py-3.5">
          <SkeletonBox className="h-4 w-24 rounded" />
        </td>
        <td className="px-4 py-3.5">
          <SkeletonBox className="h-4 w-16 rounded" />
        </td>
        <td className="px-4 py-3.5 text-right">
          <SkeletonBox className="h-6 w-14 ml-auto rounded-lg" />
        </td>
      </tr>
    ))}
  </>
);

/**
 * Skeleton pour les cartes statistiques du Dashboard Admin.
 */
export const AdminStatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="p-5 bg-surface-pure rounded-2xl border border-surface-border shadow-soft space-y-3">
        <SkeletonBox className="h-3 w-24 rounded" />
        <SkeletonBox className="h-8 w-16 rounded-lg" />
        <SkeletonBox className="h-3 w-32 rounded" />
      </div>
    ))}
  </div>
);

