import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { parseKnowledgePdfBlocks, parseKnowledgePdfInline, type KnowledgePdfInline } from '@/lib/knowledge-pdf';
import type { KnowledgeArticle } from '@/types/knowledge';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    color: '#1f2937',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.45,
  },
  title: {
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    lineHeight: 1.2,
  },
  description: {
    marginBottom: 8,
    color: '#4b5563',
  },
  metadata: {
    marginBottom: 16,
    color: '#6b7280',
    fontSize: 8.5,
    lineHeight: 1.4,
  },
  metadataRow: {
    marginBottom: 2,
  },
  heading: {
    marginTop: 12,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  headingOne: { fontSize: 20 },
  headingTwo: { fontSize: 16 },
  headingThree: { fontSize: 13 },
  headingSmall: { fontSize: 11 },
  paragraph: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  listMarker: {
    width: 16,
  },
  listText: {
    flex: 1,
  },
  blockquote: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftColor: '#9ca3af',
    borderLeftWidth: 2,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  code: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 3,
    backgroundColor: '#f3f4f6',
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 1.35,
  },
  image: {
    marginBottom: 8,
    maxHeight: 320,
    objectFit: 'contain',
  },
  muted: {
    marginBottom: 8,
    color: '#6b7280',
    fontSize: 8.5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: 'Courier',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
});

type KnowledgeArticlePdfProps = {
  article: KnowledgeArticle;
  imageSources: Map<string, string>;
};

function InlineContent({ value }: { value: string }) {
  return parseKnowledgePdfInline(value).map((token, index) => <InlineToken key={index} token={token} />);
}

function InlineToken({ token }: { token: KnowledgePdfInline }) {
  const textStyles = [
    ...(token.bold ? [styles.bold] : []),
    ...(token.italic ? [styles.italic] : []),
    ...(token.code ? [styles.inlineCode] : []),
  ];

  if (token.href) {
    return <Link src={token.href} style={styles.link}>{token.text}</Link>;
  }

  return <Text style={textStyles}>{token.text}</Text>;
}

function Heading({ level, text }: { level: number; text: string }) {
  const size = level === 1
    ? styles.headingOne
    : level === 2
      ? styles.headingTwo
      : level === 3
        ? styles.headingThree
        : styles.headingSmall;

  return <Text style={[styles.heading, size]}><InlineContent value={text} /></Text>;
}

export function KnowledgeArticlePdf({ article, imageSources }: KnowledgeArticlePdfProps) {
  const blocks = parseKnowledgePdfBlocks(article.content);

  return (
    <Document title={article.title} author={article.author ?? 'VibeDeck'}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.description}>{article.description}</Text>
        <View style={styles.metadata}>
          <Text style={styles.metadataRow}>Lesezeit: {article.readTime}</Text>
          {article.sourceURL && <Link src={article.sourceURL} style={[styles.metadataRow, styles.link]}>{article.sourceURL}</Link>}
          {article.author && <Text style={styles.metadataRow}>Autor: {article.author}</Text>}
          {article.sourceDate && <Text style={styles.metadataRow}>Quelle: {article.sourceDate}</Text>}
          {article.tags?.length ? <Text style={styles.metadataRow}>Tags: {article.tags.join(', ')}</Text> : null}
        </View>

        {blocks.map((block, index) => {
          switch (block.type) {
            case 'heading':
              return <Heading key={index} level={block.level} text={block.text} />;
            case 'paragraph':
              return <Text key={index} style={styles.paragraph}><InlineContent value={block.text} /></Text>;
            case 'unordered-list':
              return block.items.map((item, itemIndex) => (
                <View key={`${index}-${itemIndex}`} style={styles.listItem}>
                  <Text style={styles.listMarker}>•</Text>
                  <Text style={styles.listText}><InlineContent value={item} /></Text>
                </View>
              ));
            case 'ordered-list':
              return block.items.map((item, itemIndex) => (
                <View key={`${index}-${itemIndex}`} style={styles.listItem}>
                  <Text style={styles.listMarker}>{itemIndex + 1}.</Text>
                  <Text style={styles.listText}><InlineContent value={item} /></Text>
                </View>
              ));
            case 'blockquote':
              return <Text key={index} style={styles.blockquote}><InlineContent value={block.text} /></Text>;
            case 'code':
              return <Text key={index} style={styles.code}>{block.text}</Text>;
            case 'image': {
              const source = imageSources.get(block.src);
              return source
                ? <Image key={index} src={source} style={styles.image} />
                : <Text key={index} style={styles.muted}>Bild konnte nicht eingebettet werden: {block.alt || 'ohne Beschreibung'}.</Text>;
            }
            case 'dynamic-content-notice':
              return <Text key={index} style={styles.muted}>Dynamischer Inhalt ist im PDF nicht enthalten.</Text>;
          }
        })}
      </Page>
    </Document>
  );
}
