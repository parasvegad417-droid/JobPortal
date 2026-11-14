import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

const FilterCard = ({ jobs = [], selectedFilter, onFilterChange }) => {
    const filterGroups = [
        {
            filterType: 'Location',
            field: 'location',
            options: [...new Set(jobs.map(job => job.location).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b))
                .map(value => ({ value, label: value }))
        },
        {
            filterType: 'Job Type',
            field: 'jobType',
            options: [...new Set(jobs.map(job => job.jobType).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b))
                .map(value => ({ value, label: value }))
        },
        {
            filterType: 'Salary',
            field: 'salary',
            options: [...new Set(jobs.map(job => Number(job.salary)).filter(Number.isFinite))]
                .sort((a, b) => a - b)
                .map(value => ({ value, label: `${value} LPA` }))
        },
    ];

    return (
        <aside className='w-full md:sticky md:top-24'>
            <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-bold text-slate-900'>Filter Jobs</h2>
                {selectedFilter && (
                    <button
                        type='button'
                        onClick={() => onFilterChange(null)}
                        className='text-sm font-medium text-violet-700 hover:text-violet-900'
                    >
                        Clear
                    </button>
                )}
            </div>
            <RadioGroup
                value={selectedFilter ? JSON.stringify(selectedFilter) : ''}
                onValueChange={(value) => onFilterChange(JSON.parse(value))}
                className='space-y-5'
            >
                {filterGroups.map((group) => (
                    <section key={group.field}>
                        <h3 className='mb-2 text-sm font-semibold text-slate-700'>{group.filterType}</h3>
                        {group.options.length > 0 ? (
                            <div className='max-h-40 space-y-2 overflow-y-auto'>
                                {group.options.map(({ value, label }) => {
                                    const id = `${group.field}-${String(value).replace(/[^a-zA-Z0-9]/g, '-')}`;
                                    return (
                                        <div key={id} className='flex items-center gap-2'>
                                            <RadioGroupItem
                                                value={JSON.stringify({ field: group.field, value })}
                                                id={id}
                                            />
                                            <Label htmlFor={id} className='cursor-pointer text-sm text-slate-600'>
                                                {label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className='text-sm text-slate-400'>No options available</p>
                        )}
                    </section>
                ))}
            </RadioGroup>
        </aside>
    );
};

export default FilterCard;
