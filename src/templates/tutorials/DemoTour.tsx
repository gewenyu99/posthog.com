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
import React, { useEffect, useState } from 'react'
import { MdxCodeBlock } from '../../components/CodeBlock'
import { shortcodes } from '../../mdxGlobalComponents'
import { Heading } from 'components/Heading'
import TutorialsSlider from 'components/TutorialsSlider'
import { useLayoutData } from 'components/Layout/hooks'
import Title from 'components/Edition/Title'
import Upvote from 'components/Edition/Upvote'
import { Questions } from 'components/Squeak'
import { useLocation } from '@reach/router'
import qs from 'qs'
import Breadcrumbs from 'components/Edition/Breadcrumbs'
import { NewsletterForm } from 'components/NewsletterForm'
import BuiltBy from '../../components/BuiltBy'
import TeamMember from 'components/TeamMember'
import CloudinaryImage from 'components/CloudinaryImage'
import AskMax from 'components/AskMax'
import ImageSlider from 'components/ImageSlider'
import { SelectedProvider } from 'components/DemoTour/DemoContext'
import { DemoCode } from 'components/DemoTour/DemoCode'
import Callout from 'components/Docs/CalloutBox'
import { parseCodeFile, loadFileContents } from 'components/DemoTour/LoadDemoCode'

const A = (props) => <Link {...props} className="text-red hover:text-red font-semibold" />

export const Intro = ({ featuredImage, featuredVideo, title, date }) => {
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

export default function DemoTourTemplate({ data, pageContext, location, mobile = false }) {
    const { postData } = data
    const { body, excerpt, fields } = postData
    const { date, title, featuredImage, featuredVideo, featuredImageType, contributors, tags, seo, codeExamples } =
        postData?.frontmatter
    const lastUpdated = postData?.parent?.fields?.gitLogLatestDate
    const filePath = postData?.parent?.relativePath
    const category = postData?.parent?.category

    // Get the markdown file name from the path
    const processedCodeFiles = codeExamples?.map(parseCodeFile) || []
    const [fileContents, setFileContents] = useState<Record<string, string>>({})

    useEffect(() => {
        if (processedCodeFiles?.length) {
            loadFileContents(processedCodeFiles).then(setFileContents)
        }
    }, [processedCodeFiles])

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
        Callout,
        ...shortcodes,
    }
    const { tableOfContents, askMax } = pageContext
    const { fullWidthContent, theoMode, setDemoTour, setFullWidthContent } = useLayoutData()
    const { pathname } = useLocation()
    const [postID, setPostID] = useState()
    const [posthogInstance, setPosthogInstance] = useState()

    useEffect(() => {
        setDemoTour(true)
        setFullWidthContent(true)
        return () => {
            setDemoTour(false)
            setFullWidthContent(false)
        }
    }, [setDemoTour, setFullWidthContent])

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
                            <div className="">
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
                    <div className="flex-[0_0_60%] h-[50vh] @3xl:h-[calc(100vh-132px)] @3xl:flex-shrink-0 @3xl:sticky @3xl:top-[0px] @3xl:border-l @3xl:border-light @3xl:dark:border-dark bg-accent dark:bg-accent-dark">
                        <div className="h-[50vh] @3xl:h-full">
                            <DemoCode codeFiles={processedCodeFiles} fileContents={fileContents} />
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
