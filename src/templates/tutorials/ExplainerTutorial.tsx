import { MDXProvider } from '@mdx-js/react'
import { Blockquote } from 'components/BlockQuote'
import { InlineCode } from 'components/InlineCode'
import Link from 'components/Link'
import { Contributor } from 'components/PostLayout/Contributors'
import { SEO } from 'components/seo'
import { ZoomImage } from 'components/ZoomImage'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useEffect, useState, useContext } from 'react'
import { MdxCodeBlock } from '../../components/CodeBlock'
import { shortcodes } from '../../mdxGlobalComponents'
import { Heading } from 'components/Heading'
import TutorialsSlider from 'components/TutorialsSlider'
import MobileSidebar from 'components/Docs/MobileSidebar'
import { useLayoutData } from 'components/Layout/hooks'
import Title from 'components/Edition/Title'
import Upvote from 'components/Edition/Upvote'
import LikeButton from 'components/Edition/LikeButton'
import { Questions } from 'components/Squeak'
import { useLocation } from '@reach/router'
import qs from 'qs'
import Breadcrumbs from 'components/Edition/Breadcrumbs'
import { CallToAction } from 'components/CallToAction'
import { IconMap, IconOpenSidebar } from '@posthog/icons'
import { NewsletterForm } from 'components/NewsletterForm'
import BuiltBy from '../../components/BuiltBy'
import TeamMember from 'components/TeamMember'
import CloudinaryImage from 'components/CloudinaryImage'
import AskMax from 'components/AskMax'
import ImageSlider from 'components/ImageSlider'
import { SelectedProvider, SelectedContext } from 'components/CodeReference/context'
import { Tab } from 'components/Tab'
import { CodeBlock, SingleCodeBlock } from 'components/CodeBlock'
import languageMap from 'components/CodeBlock/languages'
import type { LanguageOption } from 'components/CodeBlock'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import { darkTheme, lightTheme } from 'components/CodeBlock/theme'
import { useValues } from 'kea'
import { layoutLogic } from 'logic/layoutLogic'
import { AnimatePresence, motion } from 'framer-motion'
import CodeReference from 'components/CodeReference/CodeReference'
import { Tab as HeadlessTab } from '@headlessui/react'

const A = (props) => <Link {...props} className="text-red hover:text-red font-semibold" />

export const Intro = ({
    featuredImage,
    featuredVideo,
    title,
    featuredImageType,
    titlePosition = 'bottom',
    date,
    tags,
    imageURL,
}) => {
    return (
        <div className="mb-6">
            <div>
                <Title className="text-primary dark:text-primary-dark">{title}</Title>
                <p className="mb-1 opacity-70">{date}</p>
            </div>

            {featuredVideo && <iframe src={featuredVideo} />}
            {!featuredVideo && featuredImage && (
                <GatsbyImage
                    className={`rounded-sm z-0 bg-accent dark:bg-accent-dark rounded`}
                    image={getImage(featuredImage)}
                />
            )}
        </div>
    )
}

export const Contributors = ({ contributors }) => {
    return contributors?.[0] ? (
        <>
            <div className="text-sm opacity-50 px-4 mb-2">Posted by</div>
            <div className={`mb-4 flex flex-col gap-4`}>
                {contributors.map(({ profile_id, image, name, role, profile }) => {
                    return (
                        <Contributor
                            url={profile_id && `/community/profiles/${profile_id}`}
                            image={profile?.avatar?.url || image}
                            name={profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') : name}
                            key={name}
                            role={profile?.companyRole || role}
                            text
                        />
                    )
                })}
            </div>
        </>
    ) : null
}

const ContributorsSmall = ({ contributors }) => {
    return contributors?.[0] ? (
        <div className="flex space-x-2 items-center mb-4">
            <div className="text-sm opacity-50">Posted by</div>

            <div>
                <ul className="flex list-none !m-0 !p-0 space-x-2">
                    {contributors.map(({ profile_id, name, profile, ...other }) => {
                        const image = profile?.avatar?.url || other?.image
                        const url = profile_id && `/community/profiles/${profile_id}`
                        const Container = url ? Link : 'div'
                        const gatsbyImage = image && getImage(image)
                        return (
                            <li className="!mb-0" key={name}>
                                <Container className="flex space-x-2 items-center" {...(url ? { to: url } : {})}>
                                    <span>
                                        {typeof image === 'string' ? (
                                            <CloudinaryImage
                                                width={50}
                                                className="w-6 h-6 border-border border dark:border-dark rounded-full"
                                                src={image}
                                            />
                                        ) : gatsbyImage ? (
                                            <GatsbyImage
                                                image={gatsbyImage}
                                                alt={name}
                                                className="w-6 h-6 border-border border dark:border-dark rounded-full"
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                    <span>{name}</span>
                                </Container>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    ) : null
}

const Code = ({
    language,
    children,
    showLineNumbers = false,
}: {
    language: string
    children: string
    showLineNumbers?: boolean
}) => {
    const { websiteTheme } = useValues(layoutLogic)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const { selectedLines } = useContext(SelectedContext)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(children.trim())
        setTooltipVisible(true)
        setTimeout(() => {
            setTooltipVisible(false)
        }, 1000)
    }

    return (
        <div className="code-block relative mt-2 mb-4 border border-light dark:border-dark rounded h-full flex flex-col">
            <div className="bg-accent dark:bg-accent-dark text-sm flex items-center w-full rounded-t">
                <div className="min-w-0 mr-8 px-3 py-2 font-bold opacity-50">{language}</div>
                <div className="shrink-0 ml-auto flex items-center divide-x divide-border dark:divide-border-dark">
                    <div className="relative flex items-center justify-center px-1">
                        <button
                            onClick={copyToClipboard}
                            className="text-primary/50 hover:text-primary/75 dark:text-primary-dark/50 dark:hover:text-primary-dark/75 px-1 py-1 hover:bg-light dark:hover:bg-dark border border-transparent hover:border-light dark:hover:border-dark rounded relative hover:scale-[1.02] active:top-[.5px] active:scale-[.99]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 18 18"
                                className="w-4 h-4 fill-current"
                            >
                                <g clipPath="url(#a)">
                                    <path d="M3.079 5.843h2.103V2.419c0-.58.236-1.106.618-1.487A2.1 2.1 0 0 1 7.287.313h7.634c.58 0 1.106.237 1.487.619a2.1 2.1 0 0 1 .618 1.487v7.633a2.1 2.1 0 0 1-.618 1.488 2.1 2.1 0 0 1-1.487.618h-2.103v3.424c0 .58-.236 1.106-.618 1.487a2.1 2.1 0 0 1-1.487.618H3.079c-.58 0-1.106-.236-1.487-.618a2.1 2.1 0 0 1-.618-1.487V7.948c0-.58.236-1.106.618-1.487a2.1 2.1 0 0 1 1.487-.618Zm3.28 0h4.354c.58 0 1.106.236 1.487.618a2.1 2.1 0 0 1 .618 1.487v3.033h2.103a.925.925 0 0 0 .655-.273.926.926 0 0 0 .274-.655V2.418a.925.925 0 0 0-.274-.656.926.926 0 0 0-.655-.273H7.287a.924.924 0 0 0-.655.273.926.926 0 0 0-.273.656v3.424Zm-.586 1.176H3.077a.924.924 0 0 0-.655.274.926.926 0 0 0-.273.655v7.634c0 .254.104.487.273.655.169.169.401.274.655.274h7.634a.924.924 0 0 0 .656-.274.926.926 0 0 0 .273-.655V7.948a.925.925 0 0 0-.273-.655.926.926 0 0 0-.656-.274h-4.94.002Z" />
                                </g>
                                <defs>
                                    <clipPath id="a">
                                        <path d="M0 0h18v18H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        {tooltipVisible && (
                            <AnimatePresence>
                                <motion.div
                                    className="absolute top-full mt-2 -right-2 bg-black text-white font-semibold px-2 py-1 rounded z-10"
                                    initial={{ translateY: '-50%', opacity: 0 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Copied!
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            <Highlight
                {...defaultProps}
                code={children.trim()}
                language={language as Language}
                theme={websiteTheme === 'dark' ? darkTheme : lightTheme}
            >
                {({ className, tokens, getLineProps, getTokenProps }) => (
                    <pre className="w-full m-0 p-0 rounded-t-none rounded-b bg-accent dark:bg-accent-dark border-light dark:border-dark border-t flex-1 overflow-auto">
                        <div className="flex whitespace-pre-wrap relative">
                            {showLineNumbers && (
                                <pre className="m-0 py-4 pr-3 pl-5 inline-block font-code font-medium text-sm bg-accent dark:bg-accent-dark">
                                    <span
                                        className="select-none flex flex-col dark:text-white/60 text-black/60 shrink-0"
                                        aria-hidden="true"
                                    >
                                        {tokens.map((_, i) => (
                                            <span className="inline-block text-right align-middle" key={i}>
                                                <span>{i + 1}</span>
                                            </span>
                                        ))}
                                    </span>
                                </pre>
                            )}
                            <code
                                className={`${className} block rounded-none !m-0 p-4 shrink-0 font-code font-medium text-sm article-content-ignore`}
                            >
                                {tokens.map((line, i) => {
                                    const { className, ...props } = getLineProps({ line, key: i })
                                    const isHighlighted = selectedLines.includes(i + 1)
                                    return (
                                        <div
                                            key={i}
                                            className={`${className} ${
                                                isHighlighted ? 'bg-yellow/10 dark:bg-yellow/20' : ''
                                            }`}
                                            {...props}
                                        >
                                            {line.map((token, key) => (
                                                <span key={key} {...getTokenProps({ token, key })} />
                                            ))}
                                        </div>
                                    )
                                })}
                            </code>
                        </div>
                    </pre>
                )}
            </Highlight>
        </div>
    )
}

const CodeExamples = ({ codeFiles }) => {
    const [fileContents, setFileContents] = useState<Record<string, string>>({})
    const { selectedFile, setSelectedFile } = useContext(SelectedContext)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (selectedFile) {
            const index = codeFiles.findIndex((file) => file.path === selectedFile)
            if (index !== -1) {
                setSelectedIndex(index)
            }
        }
    }, [selectedFile, codeFiles])

    const handleChange = (index: number) => {
        setSelectedIndex(index)
        setSelectedFile(codeFiles[index].path)
    }

    const getLanguage = (extension: string) => {
        // Map common file extensions to supported languages
        const extensionMap: Record<string, string> = {
            js: 'javascript',
            jsx: 'jsx',
            ts: 'typescript',
            tsx: 'jsx',
            py: 'python',
            rb: 'ruby',
            php: 'php',
            java: 'java',
            kt: 'kotlin',
            go: 'go',
            rs: 'rust',
            swift: 'swift',
            dart: 'dart',
            html: 'html',
            css: 'css',
            scss: 'css',
            less: 'css',
            json: 'json',
            yaml: 'yaml',
            yml: 'yaml',
            xml: 'xml',
            sql: 'sql',
            sh: 'bash',
            bash: 'bash',
            md: 'markdown',
            mdx: 'mdx',
            graphql: 'graphql',
            git: 'git',
        }
        return extensionMap[extension] || 'text'
    }

    const loadFileContents = async () => {
        const contents: Record<string, string> = {}
        for (const file of codeFiles) {
            try {
                // Fetch the file content using a web request
                console.log(`AHOSdlkjgkasdhgjkahsdgljkhlkj /${file.path}`)

                const response = await fetch(`/${file.path}`)
                const content = await response.text()
                contents[file.path] = content
            } catch (error) {
                console.error(`Error loading file ${file.path}:`, error)
                contents[file.path] = 'Error loading file content'
            }
        }
        console.log(contents)
        setFileContents(contents)
    }

    useEffect(() => {
        if (codeFiles?.length) {
            loadFileContents()
        }
    }, [codeFiles])

    if (!codeFiles?.length) {
        return <div className="p-4">No code examples found</div>
    }

    // Create the language options array
    const languageOptions = codeFiles.map((file) => ({
        language: getLanguage(file.extension),
        label: file.tabName,
        file: file.tabName,
        code: fileContents[file.path] || 'Loading...',
    }))

    return (
        <>
            {codeFiles.length > 0 && Object.keys(fileContents).length === codeFiles.length ? (
                <div className="h-full flex flex-col pb-4">
                    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
                        <Tab.List className="flex items-center gap-[1px] flex-wrap">
                            {languageOptions.map((option) => (
                                <Tab key={option.file}>{option.label}</Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="flex-1 h-full">
                            {languageOptions.map((option) => (
                                <Tab.Panel key={option.file} className="h-full">
                                    <Code language={option.language} showLineNumbers>
                                        {option.code}
                                    </Code>
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            ) : (
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            )}
        </>
    )
}

export default function BlogPost({ data, pageContext, location, mobile = false }) {
    const { postData } = data
    const { body, excerpt, fields } = postData
    const { date, title, featuredImage, featuredVideo, featuredImageType, contributors, tags, seo, codeExamples } =
        postData?.frontmatter
    const lastUpdated = postData?.parent?.fields?.gitLogLatestDate
    const filePath = postData?.parent?.relativePath
    const category = postData?.parent?.category

    // Get the markdown file name from the path
    const markdownFileName = filePath?.split('/').pop()?.replace('.mdx', '') || ''
    const processedCodeFiles =
        codeExamples?.map((file) => ({
            name: file.name,
            path: file,
            tabName: file.replace(`code-examples/${markdownFileName}/`, ''),
            extension: file.split('.').pop(),
        })) || []

    const components = {
        h1: (props) => Heading({ as: 'h1', ...props }),
        h2: (props) => Heading({ as: 'h2', ...props }),
        h3: (props) => Heading({ as: 'h3', ...props }),
        h4: (props) => Heading({ as: 'h4', ...props }),
        h5: (props) => Heading({ as: 'h5', ...props }),
        h6: (props) => Heading({ as: 'h6', ...props }),
        inlineCode: InlineCode,
        blockquote: Blockquote,
        pre: MdxCodeBlock,
        MultiLanguage: MdxCodeBlock,
        img: ZoomImage,
        video: (props) => (
            <ZoomImage>
                <video {...props} />
            </ZoomImage>
        ),
        a: A,
        TutorialsSlider,
        NewsletterForm,
        BuiltBy,
        TeamMember,
        ImageSlider,
        CodeReference,
        ...shortcodes,
    }
    const { tableOfContents, askMax } = pageContext
    const { fullWidthContent, theoMode, setExplainerTutorial, setFullWidthContent } = useLayoutData()
    const { pathname } = useLocation()
    const [postID, setPostID] = useState()
    const [posthogInstance, setPosthogInstance] = useState()

    useEffect(() => {
        setExplainerTutorial(true)
        setFullWidthContent(true)
        return () => {
            setExplainerTutorial(false)
            setFullWidthContent(false)
        }
    }, [setExplainerTutorial, setFullWidthContent])

    useEffect(() => {
        if (window) {
            const instanceCookie = document.cookie
                .split('; ')
                ?.filter((row) => row.startsWith('ph_current_instance='))
                ?.map((c) => c.split('=')?.[1])?.[0]
            if (instanceCookie) {
                setPosthogInstance(instanceCookie)
            }
        }
    }, [])

    useEffect(() => {
        fetch(
            `${process.env.GATSBY_SQUEAK_API_HOST}/api/posts?${qs.stringify(
                {
                    fields: ['id'],
                    filters: {
                        slug: {
                            $eq: pathname,
                        },
                    },
                },
                { encodeValuesOnly: true }
            )}`
        )
            .then((res) => res.json())
            .then((posts) => {
                if (posts?.data?.length > 0) {
                    setPostID(posts.data[0].id)
                }
            })
    }, [pathname])

    return (
        <article className="@container">
            <SEO
                title={seo?.metaTitle || title + ' - PostHog'}
                description={seo?.metaDescription || excerpt}
                article
                image={`${process.env.GATSBY_CLOUDFRONT_OG_URL}/${fields.slug.replace(/\//g, '')}.jpeg`}
                imageType="absolute"
            />
            <SelectedProvider>
                <div className="flex flex-col @3xl:flex-row h-[calc(100vh-132px)] overflow-auto">
                    <div className="article-content flex-[0_0_40%] transition-all md:pt-8 w-full h-[50vh] @3xl:h-screen">
                        <div
                            className={`mx-auto transition-all ${
                                fullWidthContent ? 'max-w-full' : 'max-w-3xl'
                            } md:px-8 2xl:px-12`}
                        >
                            <Breadcrumbs category={category} tags={tags} />
                            <Intro
                                title={title}
                                featuredImage={featuredImage}
                                featuredVideo={featuredVideo}
                                featuredImageType={featuredImageType}
                                date={date}
                                tags={tags}
                            />
                            <div className="xl:hidden">
                                <ContributorsSmall contributors={contributors} />
                            </div>

                            <MDXProvider components={components}>
                                <MDXRenderer>{body}</MDXRenderer>
                            </MDXProvider>
                            <Upvote className="mt-6" />
                            {askMax && <AskMax />}
                            <div className={`mt-8 mx-auto pb-20 ${fullWidthContent ? 'max-w-full' : 'max-w-4xl'}`}>
                                <h3>Comments</h3>
                                <Questions
                                    disclaimer={false}
                                    subject={false}
                                    buttonText="Leave a comment"
                                    slug={pathname}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-[0_0_60%] h-[50vh] @3xl:h-[calc(100vh-132px)] @3xl:flex-shrink-0 @3xl:sticky @3xl:top-[0px] @3xl:px-4 @3xl:border-l @3xl:border-light @3xl:dark:border-dark">
                        <div className="h-[50vh] @3xl:h-full">
                            <CodeExamples codeFiles={processedCodeFiles} />
                        </div>
                    </div>
                </div>
            </SelectedProvider>
        </article>
    )
}

export const SEOFragment = graphql`
    fragment SEOFragment on FrontmatterSEO {
        metaTitle
        metaDescription
    }
`

export const query = graphql`
    query BlogPostLayout($id: String!) {
        postData: mdx(id: { eq: $id }) {
            id
            body
            excerpt(pruneLength: 150)
            fields {
                slug
                pageViews
            }
            frontmatter {
                date(formatString: "MMM DD, YYYY")
                title
                sidebar
                showTitle
                tags
                category
                hideAnchor
                description
                featuredImageType
                featuredVideo
                codeExamples
                featuredImage {
                    publicURL
                    childImageSharp {
                        gatsbyImageData
                    }
                }
                contributors: authorData {
                    id
                    name
                    profile_id
                    role
                    profile {
                        firstName
                        lastName
                        companyRole
                        avatar {
                            url
                        }
                    }
                }
                seo {
                    ...SEOFragment
                }
            }
            parent {
                ... on File {
                    relativePath
                    category
                    fields {
                        gitLogLatestDate(formatString: "MMM DD, YYYY")
                    }
                }
            }
        }
        codeExamples: allFile(filter: { sourceInstanceName: { eq: "contents" } }) {
            nodes {
                name
                extension
                relativePath
                absolutePath
            }
        }
    }
`
