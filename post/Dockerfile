# ============================================
# Post Service - Dockerfile
# ============================================

# ビルドステージ
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Gradleラッパーと設定ファイルをコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 依存関係をダウンロード（キャッシュ効率化）
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

# ソースコードをコピーしてビルド
COPY src src
RUN ./gradlew bootJar --no-daemon

# 実行ステージ
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド成果物をコピー
COPY --from=builder /app/build/libs/*.jar app.jar

# ヘルスチェック用
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

# ポート公開
EXPOSE 8080

# アプリケーション起動
ENTRYPOINT ["java", "-jar", "app.jar"]