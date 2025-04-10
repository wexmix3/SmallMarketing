'use client';

const platforms = [
  { name: 'Facebook', followers: 845, engagement: '3.2%', growth: '+2.4%' },
  { name: 'Instagram', followers: 1240, engagement: '5.7%', growth: '+4.1%' },
  { name: 'Twitter', followers: 568, engagement: '2.1%', growth: '+1.2%' },
  { name: 'LinkedIn', followers: 372, engagement: '3.8%', growth: '+3.5%' },
];

export default function PerformanceMetrics() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Platform Performance</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {platforms.map((platform) => (
            <div key={platform.name} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{platform.name}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex justify-between">
                  <span>{platform.followers} followers</span>
                  <div>
                    <span className="mr-4">{platform.engagement} eng.</span>
                    <span className="text-green-600">{platform.growth}</span>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
