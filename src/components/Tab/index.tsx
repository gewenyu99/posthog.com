import React, { useEffect, useState } from 'react'
import { Tab as HeadlessTab } from '@headlessui/react'
import { classNames } from 'lib/utils'
import Slider from 'components/Slider'

export const Tab: React.FC & {
    Group: typeof HeadlessTab.Group
    List: typeof HeadlessTab.List
    Panels: typeof HeadlessTab.Panels
    Panel: typeof HeadlessTab.Panel
    count?: string
    onClick?: () => void
} = ({ count, children, onClick }) => {
    return (
        <HeadlessTab
            className={({ selected }) =>
                classNames(
                    selected
                        ? 'text-red h-full pb-2 dark:text-yellow font-bold after:h-[2px] after:bg-red dark:after:bg-yellow after:bottom-px after:content-[""] after:absolute after:left-0 after:right-0 focus:ring-transparent focus:outline-none focus-visible:ring-transparent'
                        : 'flex text-primary/75 dark:text-primary-dark/75 items-center relative my-1 rounded border border-b-3 border-transparent hover:border-light dark:hover:border-dark hover:translate-y-[-1px] active:translate-y-[1px] active:transition-all',
                    'px-2 py-1 text-sm font-semibold whitespace-nowrap rounded relative hover:scale-[1.01] active:scale-[.99] group'
                )
            }
            onClick={onClick}
        >
            {children}
            {count && (
                <span className="ml-2 bg-accent dark:bg-accent-dark border border-light dark:border-dark text-sm text-primary/60 dark:text-primary-dark/60 group-hover:text-primary/75 dark:group-hover:text-primary-dark/75 font-bold rounded-full px-2">
                    {count}
                </span>
            )}
        </HeadlessTab>
    )
}

interface TabGroupProps {
    children: React.ReactNode
    tabs?: string[]
    defaultIndex?: number
    selectedIndex?: number
    onChange?: (index: number) => void
}

const TabGroup: typeof HeadlessTab.Group = ({
    children,
    tabs,
    defaultIndex = 0,
    selectedIndex,
    onChange,
}: TabGroupProps) => {
    const [internalIndex, setInternalIndex] = useState(defaultIndex)
    const hasTabs = tabs?.length > 0
    const isControlled = selectedIndex !== undefined && onChange !== undefined
    const currentIndex = isControlled ? selectedIndex : internalIndex

    const handleChange = (index: number) => {
        if (hasTabs && typeof window !== 'undefined') {
            if (hasTabs && typeof window !== 'undefined') {
                const url = new URL(window.location.href)
                url.searchParams.set('tab', tabs[index])
                window.history.pushState({}, '', url)
            }
            onChange ? onChange(index) : setInternalIndex(index)
        }
    }

    useEffect(() => {
        if (hasTabs && typeof window !== 'undefined' && !isControlled) {
            const params = new URLSearchParams(window.location.search)
            const tabIndex = tabs.indexOf(params.get('tab') || '')
            if (tabIndex >= 0) setInternalIndex(tabIndex)
        }
    }, [])

    return (
        <HeadlessTab.Group
            selectedIndex={currentIndex}
            onChange={handleChange}
            as="div"
            className="h-full flex flex-col"
        >
            {children}
        </HeadlessTab.Group>
    )
}

TabGroup.displayName = 'TabGroup'

const TabList: typeof HeadlessTab.List = ({ children, className, ...props }) => {
    return (
        <HeadlessTab.List {...props} as={Slider} className="flex-shrink-0">
            {children}
        </HeadlessTab.List>
    )
}

TabList.displayName = 'TabList'

const TabPanels: typeof HeadlessTab.Panels = ({ children }) => {
    return <HeadlessTab.Panels className="flex-1 min-h-0">{children}</HeadlessTab.Panels>
}

TabPanels.displayName = 'TabPanels'

Tab.Group = TabGroup
Tab.List = TabList
Tab.Panel = HeadlessTab.Panel
Tab.Panels = TabPanels

export default Tab
