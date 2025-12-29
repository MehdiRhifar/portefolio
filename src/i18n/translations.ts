export interface Translations {
    nav: {
        home: string;
        projects: string;
        parcours: string;
    };
    home: {
        hero: {
            title: string;
            subtitle: string;
        };
        stats: {
            users: string;
            messages: string;
            usersDesc: string;
            messagesDesc: string;
        };
        cta: {
            projects: string;
            parcours: string;
        };
        expertise: {
            title: string;
            perf: { title: string; desc: string };
            ai: { title: string; desc: string };
            backend: { title: string; desc: string };
            database: { title: string; desc: string };
        };
        techStack: {
            label: string;
        };
        contact: {
            title: string;
            intro: string;
            email: { label: string; hint: string };
            github: { label: string };
            linkedin: { label: string };
            cv: { label: string; value: string };
        };
    };
    projects: {
        title: string;
        subtitle: string;
        professional: { title: string; description: string };
        personal: { title: string; description: string };
        viewDetails: string;
        count: (n: number) => string;
    };
    parcours: {
        title: string;
        subtitle: string;
        experiencesTitle: string;
        educationTitle: string;
        present: string;
    };
    projectDetail: {
        technologies: string;
        demo: string;
        github: string;
        npm: string;
    };
    common: {
        back: string;
        clickToCopy: string;
        copied: string;
    };
    meta: {
        jobTitle: string;
    };
}

export const translations: Record<string, Translations> = {
    fr: {
        nav: {
            home: 'Home',
            projects: 'Projets',
            parcours: 'Parcours',
        },
        home: {
            hero: {
                title: 'Salut, je suis Mehdi.<br/>Software engineer passionné',
                subtitle:
                    'Ingénieur logiciel spécialisé en développement backend.<br>Passionné par les défis techniques complexes, algorithmie et l\'optimisation de systèmes à haute performance.',
            },
            stats: {
                users: 'Utilisateurs',
                messages: 'Messages',
                usersDesc: 'Traitement temps réel concurrent (chatbot)',
                messagesDesc: 'Base de données NoSql optimisée (chatbot)',
            },
            cta: {
                projects: 'Projets',
                parcours: 'Parcours',
            },
            expertise: {
                title: 'Domaines d\'expertise',
                perf: {
                    title: 'Performance & Optimisation',
                    desc: 'Architecture asynchrone, multi-threading, optimisation de latence et throughput',
                },
                ai: {
                    title: 'IA/ML Avancé',
                    desc: 'RAG avancé (fusion, multi-query), agents autonomes, orchestration LLM multi-modèles',
                },
                backend: {
                    title: 'Architecture Backend',
                    desc: 'APIs robustes, pipelines de traitement complexes, ingénierie logicielle avancée',
                },
                database: {
                    title: 'Optimisation Databases',
                    desc: 'Requêtes avancées, indexation, recherche vectorielle, modélisation de données',
                },
            },
            techStack: {
                label: 'Stack technique',
            },
            contact: {
                title: 'Contact',
                intro:
                    'Intéressé par une collaboration ou un échange technique ? N\'hésitez pas à me contacter.',
                email: {label: 'Email', hint: 'Cliquer pour copier'},
                github: {label: 'GitHub'},
                linkedin: {label: 'LinkedIn'},
                cv: {label: 'CV', value: 'Télécharger mon CV'},
            },
        },
        projects: {
            title: 'Mes Projets',
            subtitle:
                'Une sélection de projets techniques démontrant mon expertise en développement logiciel, performance et architecture.',
            professional: {
                title: 'Projets Professionnels',
                description:
                    'Projets réalisés dans un contexte professionnel, démontrant mon expertise technique et ma capacité à livrer des solutions robustes.',
            },
            personal: {
                title: 'Projets Personnels',
                description:
                    'Projets personnels explorant de nouvelles technologies et concepts, avec un focus sur la performance et l\'innovation.',
            },
            viewDetails: 'Voir détails →',
            count: (n: number) => `💼 ${n} projet${n > 1 ? 's' : ''}`,
        },
        parcours: {
            title: 'Mon Parcours',
            subtitle:
                'Mon évolution professionnelle et académique, marquée par des projets techniques challengeants et une expertise croissante en développement logiciel.',
            experiencesTitle: 'Expériences professionnelles',
            educationTitle: 'Formation',
            present: 'Aujourd\'hui',
        },
        projectDetail: {
            technologies: 'Technologies & tools',
            demo: 'Démo en ligne',
            github: 'Code source',
            npm: 'NPM Package',
        },
        common: {
            back: 'Retour',
            clickToCopy: 'Cliquer pour copier',
            copied: '✓ Copié !',
        },
        meta: {
            jobTitle: 'Software Engineer',
        },
    },
    en: {
        nav: {
            home: 'Home',
            projects: 'Projects',
            parcours: 'Career',
        },
        home: {
            hero: {
                title: 'Hi, I\'m Mehdi.<br/>Passionate software engineer',
                subtitle:
                    'Software engineer specialized in backend development.<br>Passionate about complex technical challenges, algorithms and high-performance systems optimization.',
            },
            stats: {
                users: 'Users',
                messages: 'Messages',
                usersDesc: 'Concurrent real-time processing (chatbot)',
                messagesDesc: 'Optimized NoSQL database (chatbot)',
            },
            cta: {
                projects: 'Projects',
                parcours: 'Career',
            },
            expertise: {
                title: 'Areas of expertise',
                perf: {
                    title: 'Performance & Optimization',
                    desc: 'Asynchronous architecture, multi-threading, latency and throughput optimization',
                },
                ai: {
                    title: 'Advanced AI/ML',
                    desc: 'Advanced RAG (fusion, multi-query), autonomous agents, multi-model LLM orchestration',
                },
                backend: {
                    title: 'Backend Architecture',
                    desc: 'Robust APIs, complex processing pipelines, advanced software engineering',
                },
                database: {
                    title: 'Database Optimization',
                    desc: 'Advanced queries, indexing, vector search, data modeling',
                },
            },
            techStack: {
                label: 'Tech stack',
            },
            contact: {
                title: 'Contact',
                intro:
                    'Interested in collaboration or technical discussion? Feel free to reach out.',
                email: {label: 'Email', hint: 'Click to copy'},
                github: {label: 'GitHub'},
                linkedin: {label: 'LinkedIn'},
                cv: {label: 'Resume', value: 'Download my resume'},
            },
        },
        projects: {
            title: 'My Projects',
            subtitle:
                'A selection of technical projects demonstrating my expertise in software development, performance and architecture.',
            professional: {
                title: 'Professional Projects',
                description:
                    'Projects completed in a professional context, demonstrating my technical expertise and ability to deliver robust solutions.',
            },
            personal: {
                title: 'Personal Projects',
                description:
                    'Personal projects exploring new technologies and concepts, with a focus on performance and innovation.',
            },
            viewDetails: 'View details →',
            count: (n: number) => `💼 ${n} project${n !== 1 ? 's' : ''}`,
        },
        parcours: {
            title: 'My Career',
            subtitle:
                'My professional and academic evolution, marked by challenging technical projects and growing expertise in software development.',
            experiencesTitle: 'Professional experience',
            educationTitle: 'Education',
            present: 'Present',
        },
        projectDetail: {
            technologies: 'Technologies & tools',
            demo: 'Live demo',
            github: 'Source code',
            npm: 'NPM Package',
        },
        common: {
            back: 'Back',
            clickToCopy: 'Click to copy',
            copied: '✓ Copied!',
        },
        meta: {
            jobTitle: 'Software Engineer',
        },
    },
};
